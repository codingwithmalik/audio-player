import { connectDB } from "@/lib/db/connect";
import UserProfile from "@/schemas/UserProfile";
import { NotFoundError } from "@/lib/errors";

export const settingsService = {
  async getSettings(userId: string) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("Profile not found");
    return profile.settings;
  },

  async updateSettings(userId: string, data: any) {
    await connectDB();
    const profile = await UserProfile.findById(userId);
    if (!profile) throw new NotFoundError("Profile not found");

    if (data.playback) {
      const { equalizer, ...rest } = data.playback;
      Object.assign(profile.settings.playback, rest);
      if (equalizer)
        Object.assign(profile.settings.playback.equalizer, equalizer);
    }
    if (data.audioQuality)
      Object.assign(profile.settings.audioQuality, data.audioQuality);
    if (data.library) Object.assign(profile.settings.library, data.library);
    if (data.storage) Object.assign(profile.settings.storage, data.storage);
    if (data.privacy?.privateSession) {
      Object.assign(
        profile.settings.privacy.privateSession,
        data.privacy.privateSession,
      );
    }

    await profile.save();
    return profile.settings;
  },
};
