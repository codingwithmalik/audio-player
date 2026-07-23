import { connectDB } from "@/lib/db/connect";
import Song from "@/schemas/Song";

export const searchService = {
  async search(query: string) {
    await connectDB();
    if (!query?.trim()) return { songs: [] };

    const songs = await Song.find({ $text: { $search: query } }).limit(20);

    return { songs };
  },
};
