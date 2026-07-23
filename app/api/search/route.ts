import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/services/searchService";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q") || "";

  try {
    return NextResponse.json(await searchService.search(q));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}