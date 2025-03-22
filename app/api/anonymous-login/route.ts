import { cookies } from "next/headers";
import { verify, sign, type JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { CustomError } from "@/lib/CustomError";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import { TokenPayloadType } from "@/lib/types";

export async function POST() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const tokenValue = cookieStore.get("token")?.value;

    if (tokenValue != null) {
      const { _id, username } = verify(
        tokenValue,
        process.env.SECRET_KEY!
      ) as JwtPayload & TokenPayloadType;
      const existingUser = await User.findById(_id);
      if (existingUser != null) {
        return Response.json({ _id, username });
      }
    }

    const { _id: newUserId, username: newUserUsername } = await User.create({
      _id: new mongoose.Types.ObjectId().toString(),
      username: uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2,
        separator: "-",
      }),
    });

    const tokenPayload: TokenPayloadType = {
      _id: newUserId,
      username: newUserUsername,
    };
    const token = sign(tokenPayload, process.env.SECRET_KEY!, {
      expiresIn: "7d",
    });

    const expires = Date.now() + Number(3600 * 24 * 7) * 1000;
    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires,
    });
    return Response.json(tokenPayload);
  } catch (err) {
    console.log(err);
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
