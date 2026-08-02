import { z } from "zod";

export const createSongSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  artists: z.array(z.string().min(1)).min(1, "At least one artist is required"),
  coverImage: z.string().url().optional(),
  audioUrl: z.string().url("audioUrl must be a valid URL"),
  duration: z.number().positive("Duration must be a positive number"),
  language: z.string().optional(),
  genres: z.array(z.string()).optional(),
});

export const updateSongSchema = createSongSchema.partial(); // all fields optional, for PATCH

export const listSongsQuerySchema = z.object({
  language: z.string().optional(),
  genre: z.string().optional(),
  skip: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  ids: z.string().optional(),
});