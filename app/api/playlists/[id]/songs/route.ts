// app/api/playlists/[id]/songs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { addSongsSchema } from "@/validation/playlistSchemas";

export const POST = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const body = await req.json();
    const data = addSongsSchema.parse(body);
    const songIds = data.songIds ?? (data.songId ? [data.songId] : []);

    const playlist = await playlistService.addSongs(userId, id, songIds);
    return NextResponse.json(playlist);
  },
);
