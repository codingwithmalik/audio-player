import { Schema, models, model } from "mongoose";

const UserProfileSchema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    coverImage: { type: String },

    // Only present for credentials-based accounts. OAuth/Email accounts
    // store their email on the adapter's own `users` collection instead —
    // sparse index so multiple OAuth-only docs (no email here) don't collide.
    email: { type: String, unique: true, sparse: true },
    password: { type: String }, // hashed, only set for credentials accounts

    personalInfo: {
      gender: { type: String, default: null },
      dateOfBirth: { type: String, default: null },
      country: { type: String, default: null },
    },

    settings: {
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
  },
  { timestamps: true, _id: false },
);

export default models.UserProfile || model("UserProfile", UserProfileSchema);