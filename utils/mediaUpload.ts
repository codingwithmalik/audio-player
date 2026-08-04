// utils/mediaUpload.ts
const MAX_IMAGE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_AUDIO_SIZE_MB = 30;
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, or WEBP image.";
  }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Image must be under ${MAX_IMAGE_SIZE_MB}MB.`;
  }
  return null;
}

export function validateAudioFile(file: File): string | null {
  if (
    !file.type.startsWith("audio/") ||
    !ALLOWED_AUDIO_TYPES.includes(file.type)
  ) {
    return "Please select an audio file.";
  }
  if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
    return `Audio file must be under ${MAX_AUDIO_SIZE_MB}MB.`;
  }
  return null;
}

async function getSignature(folder: string, resourceType: "image" | "video") {
  const signRes = await fetch("/api/upload/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, resourceType }),
  });
  if (!signRes.ok) throw new Error("Failed to authorize upload");
  return signRes.json();
}

export async function uploadCover(
  file: File,
  folder: "covers" | "profile-covers" = "covers",
): Promise<{ url: string }> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder: signedFolder,
    allowedFormats,
  } = await getSignature(folder, "image");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", signedFolder);
  formData.append("allowed_formats", allowedFormats);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  if (!uploadRes.ok) throw new Error("Upload failed");

  const data = await uploadRes.json();
  return { url: data.secure_url };
}

export async function uploadAudio(
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  const validationError = validateAudioFile(file);
  if (validationError) throw new Error(validationError);

  const { signature, timestamp, cloudName, apiKey, folder } =
    await getSignature("songs", "video");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  // axios kept here specifically because it supports upload progress callbacks;
  // plain fetch has no equivalent for tracking bytes-sent during a large upload.
  const axios = (await import("axios")).default;
  const uploadRes = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    formData,
    {
      onUploadProgress: (e) => {
        if (e.total) onProgress(Math.round((e.loaded / e.total) * 100));
      },
    },
  );

  return uploadRes.data.secure_url;
}
