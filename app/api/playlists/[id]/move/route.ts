// app/api/playlists/[id]/move/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { moveToFolderSchema } from "@/validation/playlistSchemas";

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const body = await req.json();
    const { folderId } = moveToFolderSchema.parse(body);

    const playlist = await playlistService.moveToFolder(userId, id, folderId);
    return NextResponse.json(playlist);
  },
);
