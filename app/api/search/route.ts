// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/services/searchService";
import { withErrorHandling } from "@/lib/apiHandler";
import { searchQuerySchema } from "@/validation/searchSchemas";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const { q, skip, limit } = searchQuerySchema.parse(
    Object.fromEntries(searchParams),
  );

  return NextResponse.json(await searchService.search(q, { skip, limit }));
});
