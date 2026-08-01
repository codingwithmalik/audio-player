import { connectDB } from "@/lib/db/connect";
import Song from "@/schemas/Song";
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export const searchService = {
  async search(query: string, { skip = 0, limit = 20 } = {}) {
    await connectDB();
    if (!query?.trim()) return { songs: [], hasMore: false };

    const regex = new RegExp(escapeRegex(query.trim()), "i");
    const filter = { $or: [{ title: regex }, { artists: regex }] };

    const songs = await Song.find(filter)
      .skip(skip)
      .limit(limit + 1); // fetch one extra to detect "more"
    const hasMore = songs.length > limit;

    return { songs: songs.slice(0, limit), hasMore };
  },
};
