import { CustomError } from "@/lib/CustomError";
import {
  AIRequestTypeSchema,
  AIResponseTypeSchema,
  TokenPayloadType,
  ParsedOpenAIStructuredResponse,
} from "@/lib/types";
import { cookies } from "next/headers";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { verify, type JwtPayload } from "jsonwebtoken";
import Conversation, { IMessage } from "@/models/Conversation";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;

    if (tokenValue == null)
      throw new CustomError("Unauthorized: Token not found", 401);

    // we'll need to check for conversation id

    let userId: string;
    try {
      const { _id } = verify(
        tokenValue,
        process.env.SECRET_KEY!
      ) as JwtPayload & TokenPayloadType;
      userId = _id;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      throw new CustomError("Unauthorized: Invalid token", 401);
    }

    const body = await req.json();
    const parsedData = AIRequestTypeSchema.parse(body);

    const mostRecentMessage =
      parsedData.messages[parsedData.messages.length - 1];

    let conversation = await Conversation.findById(parsedData.conversationId);
    if (conversation == null) {
      conversation = new Conversation({
        _id: parsedData.conversationId,
        userId,
        messages: [],
      });
    }

    if (conversation.userId !== userId)
      throw new CustomError(
        "Unauthorized: User does not own this conversation",
        401
      );

    conversation.messages.push({
      _id: new mongoose.Types.ObjectId().toString(),
      role: mostRecentMessage.role,
      content: mostRecentMessage.content,
    } as IMessage);

    const openai = new OpenAI();

    let content = `You are a database design architect responsible for generating a database schema based on app ideas provided by the user.
            The id of the table should be the same as the name of the table. The source table and source column are the entity that can be related to more than one instance of the target table and target column.
            The response in the message section of the structured output should not be more than 2 sentences long.
            `;
    if (parsedData.databaseSchema)
      content += `
    This is the current database schema you've generated. Please make additional changes based on the user's message without drastic changes especially if the user liked it. ${JSON.stringify(
      parsedData.databaseSchema
    )}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content,
        },
        ...parsedData.messages.map((msg) => ({
          role: msg.role as "system" | "user",
          content: msg.content,
        })),
      ],
      response_format: zodResponseFormat(
        AIResponseTypeSchema,
        "schemaAndExplanation"
      ),
    });

    try {
      const structuredOutput = JSON.parse(
        completion.choices[0].message.content!
      ) as ParsedOpenAIStructuredResponse;
      conversation.databaseSchema = JSON.stringify(
        structuredOutput.databaseSchema
      );
      conversation.messages.push({
        _id: new mongoose.Types.ObjectId().toString(),
        role: "assistant",
        content: structuredOutput.message.content,
      } as IMessage);
      if (!conversation.title) {
        conversation.title = structuredOutput.title;
      }
      await conversation.save();
    } catch (err) {
      console.log(err);
    }

    return Response.json(completion.choices[0].message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err);
    return Response.json(
      {
        message: "An error occurred",
        details: err?.message ?? "",
      },
      { status: 500 }
    );
  }
}
