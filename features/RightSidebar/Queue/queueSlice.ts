import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { QueueState } from "./queueTypes";

const initialState: QueueState = {
  songIds: [],
  currentIndex: 0,
  sourceType: null,
  sourceId: null,
};

const queueSlice = createSlice({
  name: "queue",
  initialState,
  reducers: {
    addToQueue(state, action: PayloadAction<string>) {
      state.songIds.push(action.payload);
    },

    addManyToQueue(state, action: PayloadAction<string[]>) {
      state.songIds.push(...action.payload);
    },

    removeFromQueue(state, action: PayloadAction<number>) {
      state.songIds.splice(action.payload, 1);
      if (state.currentIndex >= state.songIds.length)
        state.currentIndex = Math.max(0, state.songIds.length - 1);
    },

    clearQueue(state) {
      state.songIds = [];
      state.currentIndex = 0;
      state.sourceType = null;
      state.sourceId = null;
    },

    setQueue(
      state,
      action: PayloadAction<{
        songIds: string[];
        sourceType: QueueState["sourceType"];
        sourceId: string | null;
      }>
    ) {
      state.songIds = action.payload.songIds;
      state.currentIndex = 0;
      state.sourceType = action.payload.sourceType;
      state.sourceId = action.payload.sourceId;
    },

    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },
  },
});

export const {
  addToQueue,
  addManyToQueue,
  removeFromQueue,
  clearQueue,
  setQueue,
  setCurrentIndex,
} = queueSlice.actions;

export default queueSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectQueueIds = (state: RootState) => state.queue.songIds;
export const selectCurrentIndex = (state: RootState) => state.queue.currentIndex;
export const selectQueueLength = (state: RootState) => state.queue.songIds.length;
export const selectQueueSourceType = (state: RootState) => state.queue.sourceType;
export const selectQueueSourceId = (state: RootState) => state.queue.sourceId;
export const selectIsInQueue = (state: RootState, songId: string) =>
  state.queue.songIds.includes(songId);