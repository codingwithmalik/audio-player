// app/api/search/recent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { addRecentSearchSchema } from "@/validation/searchSchemas";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const recentSearches = await profileService.getRecentSearches(userId);
  return NextResponse.json(recentSearches);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const { songId } = addRecentSearchSchema.parse(body);

  const recentSearches = await profileService.addRecentSearch(userId, songId);
  return NextResponse.json(recentSearches);
});

export const DELETE = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  await profileService.clearRecentSearches(userId);
  return NextResponse.json({ message: "Cleared" });
});
