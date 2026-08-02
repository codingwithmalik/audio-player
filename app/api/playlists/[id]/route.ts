// app/api/playlists/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { updatePlaylistSchema } from "@/validation/playlistSchemas";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const playlist = await playlistService.getPlaylist(id);
    return NextResponse.json(playlist);
  },
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const body = await req.json();
    const data = updatePlaylistSchema.parse(body);

    const playlist = await playlistService.updatePlaylist(userId, id, data);
    return NextResponse.json(playlist);
  },
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    await playlistService.softDeletePlaylist(userId, id);
    return NextResponse.json({ message: "Moved to trash" });
  },
);
