// app/api/playlists/[id]/permanent/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    await playlistService.permanentlyDelete(userId, id);
    return NextResponse.json({ message: "Deleted permanently" });
  },
);
