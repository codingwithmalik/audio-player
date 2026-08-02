import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { historyService } from "@/services/historyService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { addToHistorySchema } from "@/validation/historySchemas";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();
  return NextResponse.json(await historyService.getHistory(userId));
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const { songId } = addToHistorySchema.parse(body);

  return NextResponse.json(await historyService.addToHistory(userId, songId));
});

export const DELETE = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  await historyService.clearHistory(userId);
  return NextResponse.json({ message: "History cleared" });
});
