import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ songId: string }> },
) {
  const { songId } = await params;
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const recentSearches = await profileService.removeRecentSearch(
      userId,
      songId,
    );
    return NextResponse.json(recentSearches);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
