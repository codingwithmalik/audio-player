// app/api/folders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { folderService } from "@/services/folderService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { renameFolderSchema } from "@/validation/folderSchemas";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const folder = await folderService.getFolder(userId, id);
    return NextResponse.json(folder);
  },
);

export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    const body = await req.json();
    const { title } = renameFolderSchema.parse(body);

    const folder = await folderService.renameFolder(userId, id, title);
    return NextResponse.json(folder);
  },
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userId = await requireUserId();
    if (!userId) throw new AuthenticationError();

    await folderService.deleteFolder(userId, id);
    return NextResponse.json({
      message: "Folder deleted, playlists moved to library",
    });
  },
);
