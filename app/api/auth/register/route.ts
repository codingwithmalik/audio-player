import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";
import { generateUniqueUsername } from "@/utils/generateUsername";
import { checkEmailExists } from "@/utils/checkEmailExists";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const alreadyExists = await checkEmailExists(email);
  if (alreadyExists) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in with Google, Apple, or email link instead." },
      { status: 409 },
    );
  }

  await connectDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  const username = await generateUniqueUsername(email);

  const newUser = await UserProfile.create({
    _id: new Types.ObjectId().toString(),
    email,
    password: hashedPassword,
    username,
  });

  return NextResponse.json({ id: newUser._id, username: newUser.username });
}