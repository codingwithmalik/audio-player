// app/api/songs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { songService } from "@/services/songService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import {
  createSongSchema,
  listSongsQuerySchema,
} from "@/validation/songSchemas";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const parsed = listSongsQuerySchema.parse(Object.fromEntries(searchParams));

  if (parsed.ids) {
    const songs = await songService.getSongsByIds(parsed.ids.split(","));
    return NextResponse.json(songs);
  }

  const filter: any = {};
  if (parsed.language) filter.language = parsed.language.toLowerCase();
  if (parsed.genre) filter.genres = parsed.genre.toLowerCase();

  const songs = await songService.listSongs(filter, {
    skip: parsed.skip,
    limit: parsed.limit,
  });
  return NextResponse.json(songs);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const data = createSongSchema.parse(body);

  const song = await songService.createSong(userId, data);
  return NextResponse.json(song, { status: 201 });
});
