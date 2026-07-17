// features/Profile/settingsSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { Settings, AudioQualityLevel, PlaybackSettings } from "./types";

const initialState: Settings = {
  playback: {
    crossfadeSeconds: 0,
    gaplessPlayback: true,
    automix: true,
    audioNormalization: true,
    monoAudio: false,
    autoplaySimilar: true,
    equalizer: {
      enabled: false,
      preset: "flat",
      bands: [0, 0, 0, 0, 0, 0],
    },
  },
  audioQuality: {
    streamingQuality: "automatic",
  },
  library: {
    showDownloadedSongs: true,
  },
  storage: {
    cacheSizeMb: 0,
  },
  privacy: {
    privateSession: {
      active: false,
      expiresAt: null,
    },
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // ── Playback ──
    setCrossfadeSeconds(state, action: PayloadAction<number>) {
      state.playback.crossfadeSeconds = action.payload;
    },
    setPlaybackToggle(
      state,
      action: PayloadAction<{
        key: Extract<
          keyof PlaybackSettings,
          | "gaplessPlayback"
          | "automix"
          | "audioNormalization"
          | "monoAudio"
          | "autoplaySimilar"
        >;
        value: boolean;
      }>,
    ) {
      state.playback[action.payload.key] = action.payload.value;
    },
    setEqualizerEnabled(state, action: PayloadAction<boolean>) {
      state.playback.equalizer.enabled = action.payload;
    },
    setEqualizerPreset(state, action: PayloadAction<string>) {
      state.playback.equalizer.preset = action.payload;
    },
    setEqualizerBand(
      state,
      action: PayloadAction<{ index: number; value: number }>,
    ) {
      state.playback.equalizer.bands[action.payload.index] =
        action.payload.value;
      state.playback.equalizer.preset = "custom"; // manual tweak breaks the named preset
    },
    resetEqualizer(state) {
      state.playback.equalizer.preset = "flat";
      state.playback.equalizer.bands = state.playback.equalizer.bands.map(
        () => 0,
      );
    },

    // ── Audio quality ──
    setStreamingQuality(state, action: PayloadAction<AudioQualityLevel>) {
      state.audioQuality.streamingQuality = action.payload;
    },

    // ── Library ──
    setShowDownloadedSongs(state, action: PayloadAction<boolean>) {
      state.library.showDownloadedSongs = action.payload;
    },

    // ── Storage ──
    setCacheSizeMb(state, action: PayloadAction<number>) {
      state.storage.cacheSizeMb = action.payload;
    },

    // ── Privacy ──
    activatePrivateSession(state) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 6);
      state.privacy.privateSession = {
        active: true,
        expiresAt: expiry.toISOString(),
      };
    },
    endPrivateSession(state) {
      state.privacy.privateSession = { active: false, expiresAt: null };
    },
  },
});

export const {
  setCrossfadeSeconds,
  setPlaybackToggle,
  setEqualizerEnabled,
  setEqualizerPreset,
  setEqualizerBand,
  resetEqualizer,
  setStreamingQuality,
  setShowDownloadedSongs,
  setCacheSizeMb,
  activatePrivateSession,
  endPrivateSession,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectPlaybackSettings = (state: RootState) =>
  state.settings.playback;
export const selectAudioQualitySettings = (state: RootState) =>
  state.settings.audioQuality;
export const selectLibrarySettings = (state: RootState) =>
  state.settings.library;
export const selectStorageSettings = (state: RootState) =>
  state.settings.storage;
export const selectPrivacySettings = (state: RootState) =>
  state.settings.privacy;
export const selectIsPrivateSessionActive = (state: RootState) => {
  const { active, expiresAt } = state.settings.privacy.privateSession;
  if (!active) return false;
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return false;
  return true;
};

export default settingsSlice.reducer;
