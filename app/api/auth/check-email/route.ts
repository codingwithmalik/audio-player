import { NextRequest, NextResponse } from "next/server";
import { checkEmailExists } from "@/utils/checkEmailExists";
import { withErrorHandling } from "@/lib/apiHandler";
import { ConflictError } from "@/lib/errors";
import { checkEmailSchema } from "@/validation/authSchemas";
import { authRateLimit, checkRateLimit } from "@/lib/rateLimit";

export const POST = withErrorHandling(async (req: NextRequest) => {
    const rateLimitResponse = await checkRateLimit(req, authRateLimit);
  if (rateLimitResponse) return rateLimitResponse;
  const body = await req.json();
  const { email } = checkEmailSchema.parse(body);

  const { exists } = await checkEmailExists(email);
  if (exists)
    throw new ConflictError("An account with this email already exists.");

  return NextResponse.json({ available: true });
});
