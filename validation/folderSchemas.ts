import { z } from "zod";

export const createFolderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
});

export const renameFolderSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
});
