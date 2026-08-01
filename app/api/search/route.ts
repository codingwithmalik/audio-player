import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/services/searchService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const skip = Number(searchParams.get("skip") || 0);
  const limit = Number(searchParams.get("limit") || 20);

  try {
    return NextResponse.json(await searchService.search(q, { skip, limit }));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
