import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { historyService } from "@/services/historyService";

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    return NextResponse.json(await historyService.getHistory(userId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { songId } = await req.json();
  if (!songId)
    return NextResponse.json({ error: "songId is required" }, { status: 400 });

  try {
    return NextResponse.json(await historyService.addToHistory(userId, songId));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    await historyService.clearHistory(userId);
    return NextResponse.json({ message: "History cleared" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
