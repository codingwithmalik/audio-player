import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";

const MAX_HISTORY = 50;

export const historyService = {
  async addToHistory(userId: string, songId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new Error("User not found");

    user.history = user.history.filter((id: string) => id !== songId);
    user.history.unshift(songId);
    if (user.history.length > MAX_HISTORY)
      user.history = user.history.slice(0, MAX_HISTORY);

    await user.save();
    return user.history;
  },

  async getHistory(userId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new Error("User not found");
    return user.history;
  },

  async clearHistory(userId: string) {
    await connectDB();
    const user = await UserProfile.findById(userId);
    if (!user) throw new Error("User not found");
    user.history = [];
    await user.save();
    return [];
  },
};
