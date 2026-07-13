// features/Songs/songConstants.ts

// Not a type — plain reference lists to keep hand-authored entries
// consistent (avoids "romantic" vs "Romantic" vs "romance" drift across
// songs). Song.language and Song.genres stay plain string / string[],
// so adding a new value here is optional convenience, never required.
// Always lowercase, matching how Song data itself is stored.

export const COMMON_LANGUAGES = [
  "english",
  "hindi",
  "punjabi",
  "urdu",
  "spanish",
  "french",
  "korean",
  "arabic",
  "bengali",
  "tamil",
  "telugu",
] as const;

export const COMMON_GENRES = [
  // Mood-driven
  "romantic",
  "sad",
  "party",
  "chill",
  "energetic",
  "melancholic",
  "uplifting",

  // Genre-driven
  "pop",
  "dance",
  "hip-hop",
  "r&b",
  "rock",
  "indie",
  "indie rock",
  "electronic",
  "dark pop",
  "edm",
  "house",
  "trap",
  "lo-fi",
  "acoustic",
  "folk",
  "classical",
  "jazz",
  "reggaeton",
  "afrobeats",
  "k-pop",
  "sufi",
  "bhangra",
  "qawwali",
] as const;

export type CommonLanguage = (typeof COMMON_LANGUAGES)[number];
export type CommonGenre = (typeof COMMON_GENRES)[number];
