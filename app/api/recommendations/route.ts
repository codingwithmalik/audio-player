import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";
import { recommendationService } from "@/services/recommendationService";
import { NextRequest, NextResponse } from "next/server";

// app/api/recommendations/route.ts
export async function GET(req: NextRequest) {
  const userId = await requireUserId();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "popular"; // "trending" | "madeForYou" | "popular"
  const skip = Number(searchParams.get("skip") || 0);
  const limit = Number(searchParams.get("limit") || 20);
  const excludeIdsParam = searchParams.get("excludeIds");
  const extraExcludeIds = excludeIdsParam ? excludeIdsParam.split(",") : [];

  try {
    let songs;
    if (type === "trending") {
      songs = await recommendationService.getTrending(limit, skip,extraExcludeIds);
    } else if (type === "madeForYou" && userId) {
      const user = await profileService.getProfile(userId);
      const excludeIds = user.history ?? [];
      songs = await recommendationService.getMadeForYou(
        userId,
        limit,
        excludeIds,
        extraExcludeIds,
      );
    } else {
      songs = await recommendationService.getPopular(limit, []);
    }
    return NextResponse.json({ songs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
