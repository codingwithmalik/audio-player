import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Song = {
  id: string;
  title: string;
  artists: string[];
  coverImage?: string;
  duration: number; // seconds
  sourceType?: "playlist" | "folder" | null;
  sourceSlug?: string;
};
export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  // Current track
  currentSong: Song | null;

  // Playback
  isPlaying: boolean;
  currentTime: number; // seconds
  isShuffle: boolean;
  repeatMode: RepeatMode;

  // Volume
  volume: number; // 0–100
  prevVolume: number; // saved before mute
  isMuted: boolean;

  // Library
  isSaved: boolean;

  // UI flags
  isDraggingProgress: boolean;
  isDraggingVolume: boolean;
}

// ─── Initial state ─────────────────────────────────────────────────────────────

const initialState: PlayerState = {
  currentSong: {
    id: "1",
    title: "love lost",
    artists: ["Umair", "Talha Anjum"],
    coverImage: "/covers/love-lost.jpg",
    duration: 240,
    sourceType: "playlist",
    sourceSlug: "/playlists/chill-vibes",
  },

  isPlaying: false,
  currentTime: 79,
  isShuffle: false,
  repeatMode: "off",

  volume: 80,
  prevVolume: 80,
  isMuted: false,

  isSaved: false,

  isDraggingProgress: false,
  isDraggingVolume: false,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // ── Track ──────────────────────────────────────────────────────────────
    setSong(state, action: PayloadAction<Song>) {
      state.currentSong = action.payload;
      state.currentTime = 0;
      state.isPlaying = true;
    },
    clearSong(state) {
      state.currentSong = null;
      state.isPlaying = false;
      state.currentTime = 0;
    },

    // ── Playback ───────────────────────────────────────────────────────────
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
    setCurrentTime(state, action: PayloadAction<number>) {
      state.currentTime = action.payload;
    },
    tick(state) {
      if (!state.currentSong) return;
      if (state.currentTime >= state.currentSong.duration) {
        state.isPlaying = false;
        state.currentTime = 0;
      } else {
        state.currentTime += 1;
      }
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    cycleRepeat(state) {
      const next: Record<RepeatMode, RepeatMode> = {
        off: "all",
        all: "one",
        one: "off",
      };
      state.repeatMode = next[state.repeatMode];
    },
    setRepeatMode(state, action: PayloadAction<RepeatMode>) {
      state.repeatMode = action.payload;
    },

    // ── Volume ─────────────────────────────────────────────────────────────
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
    },
    toggleMute(state) {
      if (state.isMuted) {
        state.isMuted = false;
        state.volume = state.prevVolume || 60;
      } else {
        state.prevVolume = state.volume;
        state.isMuted = true;
      }
    },

    // ── Library ────────────────────────────────────────────────────────────
    toggleSaved(state) {
      state.isSaved = !state.isSaved;
    },
    setSaved(state, action: PayloadAction<boolean>) {
      state.isSaved = action.payload;
    },

    // ── Drag flags (used to coordinate CSS changes across components) ──────
    setDraggingProgress(state, action: PayloadAction<boolean>) {
      state.isDraggingProgress = action.payload;
    },
    setDraggingVolume(state, action: PayloadAction<boolean>) {
      state.isDraggingVolume = action.payload;
    },
  },
});

export const {
  setSong,
  clearSong,
  togglePlay,
  setPlaying,
  setCurrentTime,
  tick,
  toggleShuffle,
  cycleRepeat,
  setRepeatMode,
  setVolume,
  toggleMute,
  toggleSaved,
  setSaved,
  setDraggingProgress,
  setDraggingVolume,
} = playerSlice.actions;

export default playerSlice.reducer;

// ─── Selectors ─────────────────────────────────────────────────────────────────
// Colocated selectors so components never reach into raw state shape directly.

export const selectSong = (s: { player: PlayerState }) => s.player.currentSong;
export const selectIsPlaying = (s: { player: PlayerState }) =>
  s.player.isPlaying;
export const selectCurrentTime = (s: { player: PlayerState }) =>
  s.player.currentTime;
export const selectIsShuffle = (s: { player: PlayerState }) =>
  s.player.isShuffle;
export const selectRepeatMode = (s: { player: PlayerState }) =>
  s.player.repeatMode;
export const selectVolume = (s: { player: PlayerState }) => s.player.volume;
export const selectPrevVolume = (s: { player: PlayerState }) =>
  s.player.prevVolume;
export const selectIsMuted = (s: { player: PlayerState }) => s.player.isMuted;
export const selectIsSaved = (s: { player: PlayerState }) => s.player.isSaved;
export const selectEffectiveVol = (s: { player: PlayerState }) =>
  s.player.isMuted ? 0 : s.player.volume;
export const selectProgress = (s: { player: PlayerState }) => {
  const { currentTime, currentSong } = s.player;
  if (!currentSong || currentSong.duration === 0) return 0;
  return (currentTime / currentSong.duration) * 100;
};
export const selectIsDraggingProgress = (s: { player: PlayerState }) =>
  s.player.isDraggingProgress;
export const selectIsDraggingVolume = (s: { player: PlayerState }) =>
  s.player.isDraggingVolume;
