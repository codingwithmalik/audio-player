import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { settingsService } from "@/services/settingsService";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { updateSettingsSchema } from "@/validation/settingsSchemas";

export const GET = withErrorHandling(async () => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();
  return NextResponse.json(await settingsService.getSettings(userId));
});

export const PATCH = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const data = updateSettingsSchema.parse(body);

  return NextResponse.json(await settingsService.updateSettings(userId, data));
});
