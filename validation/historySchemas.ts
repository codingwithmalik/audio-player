import { z } from "zod";

export const addToHistorySchema = z.object({
  songId: z.string().min(1, "songId is required"),
});
