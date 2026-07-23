import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { newPassword, currentPassword } = await req.json();

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  await connectDB();
  const user = await UserProfile.findById(session.user.id);

  if (!user) {
    return NextResponse.json(
      { error: "Could not find your account" },
      { status: 404 },
    );
  }

  // If a password already exists, this is a genuine "change password" —
  // require proof of the current one, session alone isn't enough.
  // If no password exists yet, the live email-verified session already
  // proved ownership, so there's nothing to confirm against.
  if (user.password) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 },
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 },
      );
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return NextResponse.json({
    message: user.password
      ? "Password updated successfully."
      : "Password set. You can now sign in with email and password too.",
  });
}
