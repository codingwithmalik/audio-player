import { z } from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .optional(),
  coverImage: z.string().url().optional(),
  personalInfo: z
    .object({
      gender: z.string().nullable().optional(),
      dateOfBirth: z.string().nullable().optional(),
      country: z.string().nullable().optional(),
    })
    .optional(),
});
