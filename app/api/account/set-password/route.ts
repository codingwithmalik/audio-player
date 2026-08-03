import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";
import { withErrorHandling } from "@/lib/apiHandler";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "@/lib/errors";
import { setPasswordSchema } from "@/validation/authSchemas";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new AuthenticationError();

  const body = await req.json();
  const { newPassword, currentPassword } = setPasswordSchema.parse(body);

  await connectDB();
  const user = await UserProfile.findById(session.user.id);
  if (!user) throw new NotFoundError("Could not find your account");

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
    if (!currentPassword)
      throw new ValidationError("Current password is required");

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new AuthorizationError("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return NextResponse.json({ message: "Password updated successfully." });
});
