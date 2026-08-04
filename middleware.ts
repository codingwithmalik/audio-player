// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit, generalRateLimit } from "./lib/rateLimit";

const PUBLIC_API_PATTERNS = [
  /^\/api\/auth\//,
  /^\/api\/account\//,
  /^\/api\/songs(\/|$)/,
  /^\/api\/search$/,
  /^\/api\/recommendations$/,
];

const PUBLIC_PAGE_PATTERNS = [
  /^\/login$/,
  /^\/register$/,
  /^\/forgot-password$/,
  /^\/verify-request$/,
  /^\/$/, // Home — confirm this should be public
  /^\/search$/, // confirm this should be public too
  /^\/genre(\/.*)?$/, // covers /genre and /genre/[ID] (the genre detail page)
];

function matchesAny(pathname: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/api/")) {
    if (matchesAny(pathname, PUBLIC_API_PATTERNS)) return NextResponse.next();
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
     // Every authenticated API route gets a generous baseline limit
    const rateLimitResponse = await checkRateLimit(req, generalRateLimit, token.id as string);
    if (rateLimitResponse) return rateLimitResponse;

    return NextResponse.next();
  }

  // Page-level protection
  if (matchesAny(pathname, PUBLIC_PAGE_PATTERNS)) return NextResponse.next();

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname); // return here after login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)", // everything except Next's internal assets
  ],
};
