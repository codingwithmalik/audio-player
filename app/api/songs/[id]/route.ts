// app/api/songs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { songService } from "@/services/songService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { updateSongSchema } from "@/validation/songSchemas";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const song = await songService.getSong(id);
    return NextResponse.json(song);
  },
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const body = await req.json();
    const data = updateSongSchema.parse(body);

    const song = await songService.updateSong(userId, id, data);
    return NextResponse.json(song);
  },
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    await songService.deleteSong(userId, id);
    return NextResponse.json({ message: "Song deleted" });
  },
);
