// app/api/search/recent/[songId]/route.ts
import { NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ songId: string }> }) => {
    const { songId } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const recentSearches = await profileService.removeRecentSearch(
      userId,
      songId,
    );
    return NextResponse.json(recentSearches);
  },
);
