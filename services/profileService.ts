import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";
import { NotFoundError, ConflictError } from "@/lib/errors";

export const profileService = {
  async getProfile(userId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("Profile not found");
    return profile;
  },

  async updateProfile(userId: string, data: any) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("Profile not found");

    if (data.username && data.username !== profile.username) {
      const taken = await UserProfile.findOne({
        username: data.username,
        _id: { $ne: userId },
      });
      if (taken) throw new ConflictError("Username already taken");
      profile.username = data.username;
    }

    if (data.coverImage !== undefined) profile.coverImage = data.coverImage;
    if (data.personalInfo)
      Object.assign(profile.personalInfo, data.personalInfo);

    await profile.save();
    return profile;
  },

  async addRecentSearch(userId: string, songId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("User not found");

    profile.recentSearches = profile.recentSearches.filter(
      (id: string) => id !== songId,
    );
    profile.recentSearches.unshift(songId);
    if (profile.recentSearches.length > 20) profile.recentSearches.length = 20;

    await profile.save();
    return profile.recentSearches;
  },

  async removeRecentSearch(userId: string, songId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("User not found");
    profile.recentSearches = profile.recentSearches.filter(
      (id: string) => id !== songId,
    );
    await profile.save();
    return profile.recentSearches;
  },

  async clearRecentSearches(userId: string) {
    await connectDB();
    await UserProfile.findByIdAndUpdate(userId, { recentSearches: [] });
  },

  async getRecentSearches(userId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    return profile?.recentSearches ?? [];
  },
};
