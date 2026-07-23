import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";

export async function GET(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const folderId = new URL(req.url).searchParams.get("folderId");

  try {
    const playlists = await playlistService.listUserPlaylists(userId, folderId || null);
    return NextResponse.json(playlists);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  try {
    const playlist = await playlistService.createPlaylist(userId, body);
    return NextResponse.json(playlist, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}