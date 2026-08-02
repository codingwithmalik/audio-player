import { connectDB } from "@/lib/db/connect";
import PlayEvent from "@/schemas/PlayEvent";
import UserProfile from "@/schemas/UserProfile";
import { NotFoundError } from "@/lib/errors";

const MAX_HISTORY = 50;

export const historyService = {
  async addToHistory(userId: string, songId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    user.history = user.history.filter((id: string) => id !== songId);
    user.history.unshift(songId);
    if (user.history.length > MAX_HISTORY)
      user.history = user.history.slice(0, MAX_HISTORY);

    await user.save();

    PlayEvent.create({ songId, userId, playedAt: new Date() }).catch(() => {});
    return user.history;
  },

  async getHistory(userId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user.history;
  },

  async clearHistory(userId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    user.history = [];
    await user.save();
    return [];
  },
};
