import { connectDB } from "@/lib/db/connect";
import Song from "@/schemas/Song";
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export const searchService = {
  async search(query: string) {
    await connectDB();
    if (!query?.trim()) return { songs: [] };

    const regex = new RegExp(escapeRegex(query.trim()), "i");
    const songs = await Song.find({
      $or: [{ title: regex }, { artists: regex }],
    }).limit(20);

    return { songs };
  },
};
