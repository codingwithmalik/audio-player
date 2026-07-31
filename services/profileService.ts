import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";

export const profileService = {
  async getProfile(userId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new Error("Profile not found");
    return profile;
  },

  async updateProfile(
    userId: string,
    data: {
      username?: string;
      coverImage?: string;
      personalInfo?: {
        gender?: string | null;
        dateOfBirth?: string | null;
        country?: string | null;
      };
    },
  ) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new Error("Profile not found");

    if (data.username && data.username !== profile.username) {
      const taken = await UserProfile.findOne({
        username: data.username,
        _id: { $ne: userId },
      });
      if (taken) throw new Error("Username already taken");
      profile.username = data.username;
    }

    if (data.coverImage !== undefined) {
      profile.coverImage = data.coverImage;
    }

    if (data.personalInfo) {
      Object.assign(profile.personalInfo, data.personalInfo);
    }

    await profile.save();
    return profile;
  },
  // userProfileService.ts (or wherever similar history methods live)
  async addRecentSearch(userId: string, songId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new Error("User not found");

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
    if (!profile) throw new Error("User not found");
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
