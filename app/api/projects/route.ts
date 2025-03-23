import { CustomError } from "@/lib/CustomError";
import Conversation from "@/models/Conversation";
import { cookies } from "next/headers";
import { verify, type JwtPayload } from "jsonwebtoken";
import { TokenPayloadType } from "@/lib/types";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;

    if (tokenValue == null)
      throw new CustomError("Unauthorized: Token not found", 401);

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

    const conversations = await Conversation.find(
      { userId },
      { _id: 1, title: 1 },
    ).sort({ updatedAt: -1 }).lean();
    return Response.json(conversations);
  } catch (err) {
    console.error("Error:", err);
    return Response.json(
      {
        message:
          (err as CustomError)?.message ??
          "An unknown error occurred while signing you in",
      },
      { status: (err as CustomError)?.statusCode ?? 500 }
    );
  }
}
