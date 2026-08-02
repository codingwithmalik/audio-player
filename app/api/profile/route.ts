import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { updateProfileSchema } from "@/validation/profileSchemas";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const profile = await profileService.getProfile(userId);
  return NextResponse.json(profile);
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const data = updateProfileSchema.parse(body);

  const profile = await profileService.updateProfile(userId, data);
  return NextResponse.json(profile);
});
