import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { folderService } from "@/services/folderService";

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const folders = await folderService.listFolders(userId);
    return NextResponse.json(folders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { title } = await req.json();
  try {
    const folder = await folderService.createFolder(userId, title);
    return NextResponse.json(folder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
