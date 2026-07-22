import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { RepeatMode, PlayerState } from "@/features/Player/playerTypes";
import { selectSongById } from "@/features/Songs/songsSlice";

// ─── Initial state ─────────────────────────────────────────────────────────────

const initialState: PlayerState = {
  currentSongId: null,
  isPlaying: false,
  currentTime: 0,
  isShuffle: false,
  repeatMode: "off",
  volume: 80,
  prevVolume: 80,
  isMuted: false,
  isDraggingProgress: false,
  isDraggingVolume: false,
  isNowPlayingOpen: false,
};

// ─── Slice ─────────────────────────────────────────────────────────────────────

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    // ── Track ──────────────────────────────────────────────────────────────
    setSong(state, action: PayloadAction<string>) {
      state.currentSongId = action.payload;
      state.currentTime = 0;
      state.isPlaying = true;
    },
    clearSong(state) {
      state.currentSongId = null;
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
    // duration passed in as payload since song data no longer lives in this slice
    tick(state, action: PayloadAction<number>) {
      const duration = action.payload;
      if (!state.currentSongId) return;
      if (state.currentTime >= duration) {
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
    // ── Drag flags (used to coordinate CSS changes across components) ──────
    setDraggingProgress(state, action: PayloadAction<boolean>) {
      state.isDraggingProgress = action.payload;
    },
    setDraggingVolume(state, action: PayloadAction<boolean>) {
      state.isDraggingVolume = action.payload;
    },
    // Reducers
    toggleNowPlaying: (state) => {
      state.isNowPlayingOpen = !state.isNowPlayingOpen;
    },
    openNowPlaying: (state) => {
      state.isNowPlayingOpen = true;
    },
    closeNowPlaying: (state) => {
      state.isNowPlayingOpen = false;
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
  setDraggingProgress,
  setDraggingVolume,
  toggleNowPlaying,
  openNowPlaying,
  closeNowPlaying,
} = playerSlice.actions;

export default playerSlice.reducer;

// ─── Selectors ─────────────────────────────────────────────────────────────────
// Colocated selectors so components never reach into raw state shape directly.

export const selectCurrentSongId = (s: RootState) => s.player.currentSongId;
export const selectIsPlaying = (s: RootState) => s.player.isPlaying;
export const selectCurrentTime = (s: RootState) => s.player.currentTime;
export const selectIsShuffle = (s: RootState) => s.player.isShuffle;
export const selectIsMuted = (s: RootState) => s.player.isMuted;
export const selectRepeatMode = (s: RootState) => s.player.repeatMode;
export const selectVolume = (s: { player: PlayerState }) => s.player.volume;
export const selectPrevVolume = (s: RootState) => s.player.prevVolume;
export const selectIsDraggingProgress = (s: RootState) =>
  s.player.isDraggingProgress;
export const selectIsDraggingVolume = (s: RootState) =>
  s.player.isDraggingVolume;

export const selectEffectiveVol = (s: RootState) =>
  s.player.isMuted ? 0 : s.player.volume;
// Duration must be passed in from the component which has access to the current song
export const selectProgress = (duration: number) => (s: RootState) => {
  if (!duration) return 0;
  return (s.player.currentTime / duration) * 100;
};
export const selectCurrentSong = (state: RootState) => {
  const id = state.player.currentSongId;
  if (!id) return null;
  return selectSongById(state, id);
};
export const selectIsNowPlayingOpen = (state: RootState) =>
  state.player.isNowPlayingOpen;
