import { CustomError } from "@/lib/CustomError";
import Conversation from "@/models/Conversation";
import { cookies } from "next/headers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;

    if (tokenValue == null)
      throw new CustomError("Unauthorized: Token not found", 401);

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
