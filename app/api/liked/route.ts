import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const liked = await playlistService.ensureLikedPlaylist(userId);
    return NextResponse.json(liked);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
