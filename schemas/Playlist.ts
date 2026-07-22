import { Schema, models, model, Types } from "mongoose";

const PlaylistSongSchema = new Schema(
  {
    songId: { type: String, required: true, ref: "Song" },
    addedAt: { type: Date, required: true },
  },
  { _id: false },
);

const PlaylistSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => new Types.ObjectId().toString(),
    },
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    songs: { type: [PlaylistSongSchema], default: [] },
    folderId: { type: String, ref: "Folder", default: null },
    ownerId: { type: String, required: true, ref: "UserProfile" },
    accessedAt: { type: Date },
    deletedAt: { type: Date }, // presence = in trash, expiry computed at query time (deletedAt + 90d)
  },
  { timestamps: true, _id: false },
);

// Supports both "user's top-level playlists" and "playlists inside a folder" queries
PlaylistSchema.index({ ownerId: 1, folderId: 1 });

export default models.Playlist || model("Playlist", PlaylistSchema);
