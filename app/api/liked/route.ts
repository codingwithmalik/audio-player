// app/api/liked/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const liked = await playlistService.ensureLikedPlaylist(userId);
  return NextResponse.json(liked);
});
