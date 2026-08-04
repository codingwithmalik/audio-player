import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireUserId } from "@/lib/auth/requireUserId";
import { withErrorHandling } from "@/lib/apiHandler";
import { AuthenticationError } from "@/lib/errors";
import { signUploadSchema } from "@/validation/uploadSchemas";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = await requireUserId();
  if (!userId) throw new AuthenticationError();

  const body = await req.json();
  const { folder, resourceType } = signUploadSchema.parse(body);

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign: Record<string, any> = {
    timestamp,
    folder: folder || "audious",
  };

  if (resourceType === "image") {
    paramsToSign.allowed_formats = "jpg,png,webp";
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: paramsToSign.folder,
    allowedFormats: paramsToSign.allowed_formats,
  });
});
