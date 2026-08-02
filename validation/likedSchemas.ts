import { z } from "zod";

export const toggleLikedSchema = z.object({
  songId: z.string().min(1, "songId is required"),
});