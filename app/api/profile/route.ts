import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth/requireUserId";
import { profileService } from "@/services/profileService";

export async function GET() {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const profile = await profileService.getProfile(userId);
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PATCH(req: NextRequest) {
  const userId = await requireUserId();
  if (!userId)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  try {
    const profile = await profileService.updateProfile(userId, body);
    return NextResponse.json(profile);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
