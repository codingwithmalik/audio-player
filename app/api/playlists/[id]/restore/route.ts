import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const playlist = await playlistService.restorePlaylist(userId, id);
    return NextResponse.json(playlist);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
