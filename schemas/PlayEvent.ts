import { Schema, models, model } from "mongoose";

const PlayEventSchema = new Schema({
  songId: { type: String, required: true, ref: "Song" },
  userId: { type: String, required: true, ref: "UserProfile" },
  playedAt: { type: Date, required: true, default: Date.now },
});

// Supports the trending aggregation's date-range match
PlayEventSchema.index({ playedAt: 1 });
PlayEventSchema.index({ songId: 1, playedAt: 1 });

// TTL index: MongoDB automatically deletes documents once `playedAt` is
// older than 30 days — no cron job, no manual cleanup needed. The number
// is in seconds: 30 days * 24h * 60m * 60s.
PlayEventSchema.index({ playedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default models.PlayEvent || model("PlayEvent", PlayEventSchema);