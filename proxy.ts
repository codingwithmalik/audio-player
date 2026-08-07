// proxy.ts
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
  /^\/$/,
  /^\/search$/,
  /^\/genre(\/.*)?$/,
  /^\/admin\/login$/,
];

const ADMIN_ROUTE_PATTERN = /^\/(api\/admin|admin)(\/|$)/;

function matchesAny(pathname: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(pathname));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // FIX: Allow the admin login page to be accessed without auth checks
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }
  if (ADMIN_ROUTE_PATTERN.test(pathname)) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 },
        );
      }
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 },
        );
      }
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (matchesAny(pathname, PUBLIC_API_PATTERNS)) return NextResponse.next();
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const rateLimitResponse = await checkRateLimit(
      req,
      generalRateLimit,
      token.id as string,
    );
    if (rateLimitResponse) return rateLimitResponse;
    return NextResponse.next();
  }

  if (matchesAny(pathname, PUBLIC_PAGE_PATTERNS)) return NextResponse.next();

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
