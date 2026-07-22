import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend globalThis properly instead of casting to `any` —
// avoids the type warning while still surviving Next.js hot reloads in dev.
declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<Mongoose> {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
