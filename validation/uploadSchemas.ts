import { z } from "zod";

export const signUploadSchema = z.object({
  folder: z.enum(["songs", "covers", "profile-covers", "audious"]).optional(),
  resourceType: z.enum(["image", "video"]).default("image"),
});
