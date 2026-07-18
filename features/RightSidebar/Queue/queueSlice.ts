import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { QueueState } from "./queueTypes";

const initialState: QueueState = {
  songIds: [],
  originalSongIds: [],
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
      state.originalSongIds.push(action.payload);
    },

    addManyToQueue(state, action: PayloadAction<string[]>) {
      state.songIds.push(...action.payload);
      state.originalSongIds.push(...action.payload);
    },

    removeFromQueue(state, action: PayloadAction<number>) {
      state.songIds.splice(action.payload, 1);
      if (state.currentIndex >= state.songIds.length)
        state.currentIndex = Math.max(0, state.songIds.length - 1);
    },

    clearQueue(state) {
      state.songIds = [];
      state.originalSongIds = [];
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
      }>,
    ) {
      state.songIds = action.payload.songIds;
      state.originalSongIds = action.payload.songIds;
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

    /** Shuffles only upcoming (not-yet-played) songs; already-played history stays put. */
    shuffleQueue(state) {
      const played = state.songIds.slice(0, state.currentIndex + 1);
      const upcoming = state.songIds.slice(state.currentIndex + 1);

      for (let i = upcoming.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
      }

      state.songIds = [...played, ...upcoming];
    },

    /** Restores original order, resuming at wherever the current song naturally sits. */
    unshuffleQueue(
      state,
      action: PayloadAction<{ currentSongId: string | null }>,
    ) {
      state.songIds = [...state.originalSongIds];
      const idx = action.payload.currentSongId
        ? state.originalSongIds.indexOf(action.payload.currentSongId)
        : -1;
      state.currentIndex = idx >= 0 ? idx : 0;
    },
    /**
     * Reorders across the combined "upcoming" list (manual + context), and can
     * move items between the two sections depending on drop position.
     *
     * fromIndex/toIndex are positions within [...manualQueueIds, ...contextUpcoming] —
     * i.e. exactly what selectUpcomingIds returns, index-for-index.
     *
     * Classification rule: after the move, whichever items land at or before
     * the (adjusted) manual boundary become manual; everything after becomes
     * context. Dropping a manual song later in the list "demotes" it into the
     * context queue, and vice versa for promoting a context song forward.
     */
    reorderUpcoming(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>,
    ) {
      const { fromIndex, toIndex } = action.payload;
      const manualLen = state.manualQueueIds.length;
      const contextUpcoming = state.songIds.slice(state.currentIndex + 1);
      const combined = [...state.manualQueueIds, ...contextUpcoming];

      if (
        fromIndex < 0 ||
        fromIndex >= combined.length ||
        toIndex < 0 ||
        toIndex >= combined.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const removedWasManual = fromIndex < manualLen;
      const [moved] = combined.splice(fromIndex, 1);
      const manualLenAfterRemoval = removedWasManual
        ? manualLen - 1
        : manualLen;

      const insertAt = Math.min(toIndex, combined.length);
      combined.splice(insertAt, 0, moved);

      const newManualLen =
        insertAt <= manualLenAfterRemoval
          ? manualLenAfterRemoval + 1
          : manualLenAfterRemoval;

      state.manualQueueIds = combined.slice(0, newManualLen);
      state.songIds = [
        ...state.songIds.slice(0, state.currentIndex + 1),
        ...combined.slice(newManualLen),
      ];
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
  shuffleQueue,
  unshuffleQueue,
  reorderUpcoming,
} = queueSlice.actions;

export default queueSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectQueueIds = (state: RootState) => state.queue.songIds;
export const selectCurrentIndex = (state: RootState) =>
  state.queue.currentIndex;
export const selectQueueLength = (state: RootState) =>
  state.queue.songIds.length;
export const selectQueueSourceType = (state: RootState) =>
  state.queue.sourceType;
export const selectQueueSourceId = (state: RootState) => state.queue.sourceId;
export const selectIsInQueue = (state: RootState, songId: string) =>
  state.queue.songIds.includes(songId);

export const selectManualQueueIds = (state: RootState) =>
  state.queue.manualQueueIds;
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
