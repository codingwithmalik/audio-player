// app/api/songs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { songService } from "@/services/songService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { updateSongSchema } from "@/validation/songSchemas";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AuthenticationError();
    if (session.user.role !== "admin")
      throw new AuthorizationError("Admin access required");

    const body = await req.json();
    const data = updateSongSchema.parse(body);

    const song = await songService.updateSong(session.user.id, id, data);
    return NextResponse.json(song);
  },
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new AuthenticationError();
    if (session.user.role !== "admin")
      throw new AuthorizationError("Admin access required");

    await songService.deleteSong(session.user.id, id);
    return NextResponse.json({ message: "Song deleted" });
  },
);
