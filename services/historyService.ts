import { connectDB } from "@/lib/db/connect";
import PlayEvent from "@/schemas/PlayEvent";
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

    // Fire-and-forget: record the play event for trending, without blocking
    // or failing the main history update if this insert has an issue.
    PlayEvent.create({ songId, userId, playedAt: new Date() }).catch(() => {});
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
