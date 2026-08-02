import { z } from "zod";

const equalizerSchema = z.object({
  enabled: z.boolean().optional(),
  preset: z.string().optional(),
  bands: z.array(z.number().min(-12).max(12)).length(6).optional(),
});

const playbackSchema = z.object({
  crossfadeSeconds: z.number().min(0).max(12).optional(),
  gaplessPlayback: z.boolean().optional(),
  automix: z.boolean().optional(),
  audioNormalization: z.boolean().optional(),
  monoAudio: z.boolean().optional(),
  autoplaySimilar: z.boolean().optional(),
  equalizer: equalizerSchema.optional(),
});

const audioQualitySchema = z.object({
  streamingQuality: z.enum(["low", "normal", "high", "automatic"]).optional(),
});

const librarySchema = z.object({
  showDownloadedSongs: z.boolean().optional(),
});

const storageSchema = z.object({
  cacheSizeMb: z.number().min(0).optional(),
});

const privacySchema = z.object({
  privateSession: z
    .object({
      active: z.boolean().optional(),
      expiresAt: z.string().nullable().optional(),
    })
    .optional(),
});

export const updateSettingsSchema = z.object({
  playback: playbackSchema.optional(),
  audioQuality: audioQualitySchema.optional(),
  library: librarySchema.optional(),
  storage: storageSchema.optional(),
  privacy: privacySchema.optional(),
});
