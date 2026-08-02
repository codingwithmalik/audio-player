// app/api/playlists/[id]/songs/[songId]/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";

export const DELETE = withErrorHandling(
  async (
    req,
    { params }: { params: Promise<{ id: string; songId: string }> },
  ) => {
    const { id, songId } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const playlist = await playlistService.removeSong(userId, id, songId);
    return NextResponse.json(playlist);
  },
);
