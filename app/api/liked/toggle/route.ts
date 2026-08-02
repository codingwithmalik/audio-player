// app/api/liked/toggle/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { toggleLikedSchema } from "@/validation/likedSchemas";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const { songId } = toggleLikedSchema.parse(body);

  const result = await playlistService.toggleLikedSong(userId, songId);
  return NextResponse.json(result);
});
