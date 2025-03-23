import { CustomError } from "@/lib/CustomError";
import Conversation from "@/models/Conversation";
import { cookies } from "next/headers";
import { verify, type JwtPayload } from "jsonwebtoken";
import { TokenPayloadType } from "@/lib/types";
import dbConnect from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;

    if (tokenValue == null)
      throw new CustomError("Unauthorized: Token not found", 401);

    try {
      verify(tokenValue, process.env.SECRET_KEY!) as JwtPayload &
        TokenPayloadType;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      throw new CustomError("Unauthorized: Invalid token", 401);
    }

    const { id } = await params;
    const conversation = await Conversation.findById(id);
    if (conversation == null)
      throw new CustomError("Conversation not found", 404);
    return Response.json(conversation);
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
