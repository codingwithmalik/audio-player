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

  // A session established within the last 5 minutes means this request is
  // arriving right after a real sign-in event (magic link or Google) — that
  // freshly-proven ownership stands in for currentPassword, same reasoning
  // as the original "no password set" case. An older, already-standing
  // session doesn't get this pass, and must supply currentPassword instead.
  const FRESH_SESSION_WINDOW_SECONDS = 5 * 60;
  const sessionAgeSeconds =
    Math.floor(Date.now() / 1000) - (session.sessionIssuedAt ?? 0);
  const isFreshSession = sessionAgeSeconds < FRESH_SESSION_WINDOW_SECONDS;

  if (user.password && !isFreshSession) {
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
    message: "Password updated successfully.",
  });
}
