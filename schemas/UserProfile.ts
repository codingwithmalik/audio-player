import { Schema, models, model } from "mongoose";

const UserProfileSchema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    coverImage: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },

    personalInfo: {
      gender: { type: String, default: null },
      dateOfBirth: { type: String, default: null },
      country: { type: String, default: null },
    },

    settings: {
      playback: {
        crossfadeSeconds: { type: Number, default: 0 },
        gaplessPlayback: { type: Boolean, default: true },
        automix: { type: Boolean, default: true },
        audioNormalization: { type: Boolean, default: true },
        monoAudio: { type: Boolean, default: false },
        autoplaySimilar: { type: Boolean, default: true },
        equalizer: {
          enabled: { type: Boolean, default: false },
          preset: { type: String, default: "flat" },
          bands: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
        },
      },
      audioQuality: {
        streamingQuality: { type: String, default: "automatic" },
      },
      library: {
        showDownloadedSongs: { type: Boolean, default: false },
      },
      storage: {
        cacheSizeMb: { type: Number, default: 0 },
      },
      privacy: {
        privateSession: {
          active: { type: Boolean, default: false },
          expiresAt: { type: String, default: null },
        },
      },
    },

    history: { type: [String], default: [] },
    recentSearches: { type: [String], default: [] }, // song ids, most-recent-first — mirrors `history` shape exactly
  },
  { timestamps: true, _id: false },
);
UserProfileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default models.UserProfile || model("UserProfile", UserProfileSchema);
