import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Sliding window: allows `limit` requests per `window`, smoothly rolling
// (not a hard reset at fixed intervals — fairer than a fixed-window approach).
export const searchRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"), // 20 requests per 60 seconds
  prefix: "ratelimit:search",
});

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // stricter — auth abuse is higher-stakes
  prefix: "ratelimit:auth",
});

export const generalRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "ratelimit:general",
});

// Identifies the caller — prefers a logged-in user's id (via a header we'll
// set from requireUserId in the route), falls back to IP for anonymous callers.
function getIdentifier(req: NextRequest, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  return `ip:${ip}`;
}

export async function checkRateLimit(
  req: NextRequest,
  limiter: Ratelimit,
  userId?: string | null,
): Promise<NextResponse | null> {
  const identifier = getIdentifier(req, userId);
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
          "X-RateLimit-Reset": String(reset),
        },
      },
    );
  }

  return null; // null = allowed, proceed with the request
}
