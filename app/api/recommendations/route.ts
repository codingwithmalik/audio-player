import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";
import { recommendationService } from "@/services/recommendationService";
import { withErrorHandling } from "@/lib/apiHandler";
import { recommendationsQuerySchema } from "@/validation/recommendationSchemas";
import { checkRateLimit, generalRateLimit } from "@/lib/rateLimit";

export const GET = withErrorHandling(async (req: NextRequest) => {
    const rateLimitResponse = await checkRateLimit(req, generalRateLimit);
  if (rateLimitResponse) return rateLimitResponse;
  const userId = await requireUserId();
  const { searchParams } = new URL(req.url);
  const { type, skip, limit, excludeIds } = recommendationsQuerySchema.parse(
    Object.fromEntries(searchParams),
  );
  const extraExcludeIds = excludeIds ? excludeIds.split(",") : [];

  let songs;
  if (type === "trending") {
    songs = await recommendationService.getTrending(
      limit,
      skip,
      extraExcludeIds,
    );
  } else if (type === "madeForYou" && userId) {
    const user = await profileService.getProfile(userId);
    const recentSongIds = user.history ?? [];
    songs = await recommendationService.getMadeForYou(
      userId,
      limit,
      recentSongIds,
      extraExcludeIds,
    );
  } else {
    songs = await recommendationService.getPopular(limit, []);
  }

  return NextResponse.json({ songs });
});
