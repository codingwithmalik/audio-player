import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { songService } from "@/services/songService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get("language") || undefined;
  const genre = searchParams.get("genre") || undefined;
  const skip = Number(searchParams.get("skip") || 0);
  const limit = Number(searchParams.get("limit") || 20);

  const filter: any = {};
  if (language) filter.language = language.toLowerCase();
  if (genre) filter.genres = genre.toLowerCase();

  try {
    const songs = await songService.listSongs(filter, { skip, limit });
    return NextResponse.json(songs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  try {
    const song = await songService.createSong(userId, body);
    return NextResponse.json(song, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
