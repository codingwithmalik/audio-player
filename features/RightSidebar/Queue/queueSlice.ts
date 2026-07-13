import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { QueueState } from "./queueTypes";

const initialState: QueueState = {
  songIds: [],
  currentIndex: 0,
  sourceType: null,
  sourceId: null,
  manualQueueIds: [],
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
      state.manualQueueIds = [];
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
      // manualQueueIds deliberately untouched — a manual queue survives
      // switching to a new context, per product decision.
    },

    setCurrentIndex(state, action: PayloadAction<number>) {
      state.currentIndex = action.payload;
    },

    // ── Manual queue ("Add to Queue") ───────────────────────────────────────
    addToManualQueue(state, action: PayloadAction<string>) {
      state.manualQueueIds.push(action.payload);
    },

    addManyToManualQueue(state, action: PayloadAction<string[]>) {
      state.manualQueueIds.push(...action.payload);
    },

    shiftManualQueue(state) {
      state.manualQueueIds.shift();
    },

    clearManualQueue(state) {
      state.manualQueueIds = [];
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
  addToManualQueue,
  addManyToManualQueue,
  shiftManualQueue,
  clearManualQueue,
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

export const selectManualQueueIds = (state: RootState) => state.queue.manualQueueIds;
export const selectHasManualQueue = (state: RootState) =>
  state.queue.manualQueueIds.length > 0;

// Manual queue first, then whatever's left in the context queue —
// this is the actual "what plays next" order, used by QueuePanel.
export const selectUpcomingIds = createSelector(
  [selectManualQueueIds, selectQueueIds, selectCurrentIndex],
  (manualIds, contextIds, currentIndex) => [
    ...manualIds,
    ...contextIds.slice(currentIndex + 1),
  ],
);