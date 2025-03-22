import { AIRequestTypeSchema, AIResponseTypeSchema } from "@/lib/types";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = AIRequestTypeSchema.parse(body);
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
