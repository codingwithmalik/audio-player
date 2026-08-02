// app/api/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import {
  createPlaylistSchema,
  listPlaylistsQuerySchema,
} from "@/validation/playlistSchemas";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const { searchParams } = new URL(req.url);
  const { folderId } = listPlaylistsQuerySchema.parse(
    Object.fromEntries(searchParams),
  );

  const playlists = await playlistService.listUserPlaylists(
    userId,
    folderId || null,
  );
  return NextResponse.json(playlists);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const data = createPlaylistSchema.parse(body);

  const playlist = await playlistService.createPlaylist(userId, data);
  return NextResponse.json(playlist, { status: 201 });
});
