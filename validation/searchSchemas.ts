import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().optional().default(""),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const addRecentSearchSchema = z.object({
  songId: z.string().min(1, "songId is required"),
});
