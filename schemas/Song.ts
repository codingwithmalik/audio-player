import { Schema, models, model } from "mongoose";

const SongSchema = new Schema(
  {
    title: { type: String, required: true },
    artists: { type: [String], required: true },
    coverImage: { type: String },
    audioUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    uploadedBy: { type: String, required: true, ref: "UserProfile" },
    language: { type: String, lowercase: true },
    genres: { type: [String], lowercase: true },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);
SongSchema.index({ title: "text", artists: "text" });
export default models.Song || model("Song", SongSchema);
