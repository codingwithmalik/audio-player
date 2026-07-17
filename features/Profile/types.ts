// features/Profile/types.ts

// ---- Personal info & account ----

import type { User } from "@/types/user";
import type { PersonalInfo } from "./accountSlice";

/** Full user-facing profile — combines session identity with editable
 *  personal info. Nothing is stored in this shape; it's assembled by
 *  components that read both authSlice and accountSlice separately. */
export type FullUserProfile = User & PersonalInfo;

// ---- Settings, nested by category ----

export type AudioQualityLevel = "low" | "normal" | "high" | "automatic";

export type ProfileTab = "profile" | "account" | "recents" | "settings";

export interface PlaybackSettings {
  crossfadeSeconds: number; // 0-12, drives the useSliderDrag-based slider
  gaplessPlayback: boolean;
  automix: boolean;
  audioNormalization: boolean;
  monoAudio: boolean;
  autoplaySimilar: boolean;
  equalizer: {
    enabled: boolean;
    preset: string; // "flat" or a named preset; plain string, no rigid union
    bands: number[]; // dB per band, -12 to +12; length = number of band handles
  };
}

export interface AudioQualitySettings {
  streamingQuality: AudioQualityLevel;
}

export interface LibrarySettings {
  showDownloadedSongs: boolean;
}

export interface StorageSettings {
  cacheSizeMb: number; // informational, read-only from the UI's perspective
}

export interface PrivacySettings {
  privateSession: {
    active: boolean;
    expiresAt: string | null; // ISO timestamp, set to now+6h on activation
  };
}

export interface Settings {
  playback: PlaybackSettings;
  audioQuality: AudioQualitySettings;
  library: LibrarySettings;
  storage: StorageSettings;
  privacy: PrivacySettings;
}

export type SettingsCategory = keyof Settings;
