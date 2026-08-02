import { z } from "zod";

export const createPlaylistSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
});

export const updatePlaylistSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
  accessedAt: z.string().datetime().optional(),
  songs: z
    .array(
      z.object({
        songId: z.string(),
        addedAt: z.string().datetime().or(z.date()),
      }),
    )
    .optional(),
});

export const addSongsSchema = z
  .object({
    songId: z.string().optional(),
    songIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.songId || (data.songIds && data.songIds.length > 0), {
    message: "songId or songIds is required",
  });

export const moveToFolderSchema = z.object({
  folderId: z.string().nullable(),
});

export const listPlaylistsQuerySchema = z.object({
  folderId: z.string().optional(),
});
