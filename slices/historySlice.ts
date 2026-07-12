import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

const MAX_HISTORY = 50;

interface HistoryState {
  recentSongIds: string[]; // most-recent-first
}

const initialState: HistoryState = {
  recentSongIds: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    songPlayed: (state, action: PayloadAction<string>) => {
      const songId = action.payload;
      // Dedupe: if it's already in history, drop the old entry first
      // so it moves to the front instead of appearing twice.
      state.recentSongIds = state.recentSongIds.filter((id) => id !== songId);
      state.recentSongIds.unshift(songId);
      if (state.recentSongIds.length > MAX_HISTORY) {
        state.recentSongIds.length = MAX_HISTORY;
      }
    },
    clearHistory: (state) => {
      state.recentSongIds = [];
    },
  },
});

export const { songPlayed, clearHistory } = historySlice.actions;

export const selectRecentSongIds = (state: RootState) =>
  state.history.recentSongIds;

export default historySlice.reducer;
