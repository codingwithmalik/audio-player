import { NextRequest, NextResponse } from "next/server";
import { checkEmailExists } from "@/utils/checkEmailExists";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { exists } = await checkEmailExists(email);

  if (exists) {
    return NextResponse.json(
      { available: false, error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  return NextResponse.json({ available: true });
}
