// app/api/folders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { folderService } from "@/services/folderService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { createFolderSchema } from "@/validation/folderSchemas";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const folders = await folderService.listFolders(userId);
  return NextResponse.json(folders);
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const { title } = createFolderSchema.parse(body);

  const folder = await folderService.createFolder(userId, title);
  return NextResponse.json(folder, { status: 201 });
});
