// app/api/playlists/trash/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { playlistService } from "@/services/playlistService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const trashed = await playlistService.listTrash(userId);
  return NextResponse.json(trashed);
});
