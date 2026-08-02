import { z } from "zod";

export const recommendationsQuerySchema = z.object({
  type: z.enum(["trending", "madeForYou", "popular"]).default("popular"),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  excludeIds: z.string().optional(),
});
