import { z } from "zod";

export const setPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  currentPassword: z.string().optional(),
});

export const checkEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});