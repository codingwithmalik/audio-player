import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { folderService } from "@/services/folderService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const folder = await folderService.getFolder(userId, id);
    return NextResponse.json(folder);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { title } = await req.json();
  try {
    const folder = await folderService.renameFolder(userId, id, title);
    return NextResponse.json(folder);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    await folderService.deleteFolder(userId, id);
    return NextResponse.json({
      message: "Folder deleted, playlists moved to library",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
