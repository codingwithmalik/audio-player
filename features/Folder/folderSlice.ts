/**
 * foldersSlice
 * ------------
 * Normalized cache of all Folder objects.
 *
 * Simpler than playlistsSlice on purpose — folders have no search,
 * sort, or view mode UI. Just entities, fetch status, and error.
 */

import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Folder } from "@/types/folder";
import type { RootState } from "@/store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

type FetchStatus = "idle" | "loading" | "done" | "error";

interface FoldersState {
  entities: Record<string, Folder>;
  fetchStatus: Record<string, FetchStatus>;
  error: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: FoldersState = {
  entities: {},
  fetchStatus: {},
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const foldersSlice = createSlice({
  name: "folders",
  initialState,
  reducers: {
    // ── Entity actions ────────────────────────────────────────────────────────

    upsertFolders(state, action: PayloadAction<Folder[]>) {
      for (const folder of action.payload) {
        state.entities[folder.id] = folder;
        state.fetchStatus[folder.id] = "done";
      }
    },

    setFetchStatus(
      state,
      action: PayloadAction<{ id: string; status: FetchStatus }>,
    ) {
      state.fetchStatus[action.payload.id] = action.payload.status;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    addFolder(state, action: PayloadAction<Folder>) {
      state.entities[action.payload.id] = action.payload;
      state.fetchStatus[action.payload.id] = "done";
    },

    removeFolder(state, action: PayloadAction<string>) {
      delete state.entities[action.payload];
      delete state.fetchStatus[action.payload];
    },

    updateFolderMeta(
      state,
      action: PayloadAction<{ id: string; title: string }>,
    ) {
      const folder = state.entities[action.payload.id];
      if (!folder) return;
      folder.title = action.payload.title;
      folder.updatedAt = new Date().toISOString();
    },

    addPlaylistToFolder(
      state,
      action: PayloadAction<{ folderId: string; playlistId: string }>,
    ) {
      const folder = state.entities[action.payload.folderId];
      if (!folder) return;
      if (folder.playlistIds.includes(action.payload.playlistId)) return;
      folder.playlistIds.push(action.payload.playlistId);
      folder.updatedAt = new Date().toISOString();
    },

    removePlaylistFromFolder(
      state,
      action: PayloadAction<{ folderId: string; playlistId: string }>,
    ) {
      const folder = state.entities[action.payload.folderId];
      if (!folder) return;
      folder.playlistIds = folder.playlistIds.filter(
        (id) => id !== action.payload.playlistId,
      );
      folder.updatedAt = new Date().toISOString();
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  upsertFolders,
  setFetchStatus,
  setError,
  addFolder,
  removeFolder,
  updateFolderMeta,
  addPlaylistToFolder,
  removePlaylistFromFolder,
} = foldersSlice.actions;

// ─── Base selectors ───────────────────────────────────────────────────────────

export const selectFolders = createSelector(
  [(state: RootState) => state.folders.entities],
  (entities) => Object.values(entities),
);

export const selectFolderById = (state: RootState, id: string) =>
  state.folders.entities[id] ?? null;

export const selectFolderFetchStatus = (
  state: RootState,
  id: string,
): FetchStatus => state.folders.fetchStatus[id] ?? "idle";

export const selectFoldersError = (state: RootState) => state.folders.error;

// ── Owner-scoped — same pattern used in librarySlice ──
// export const selectFoldersByOwner = createSelector(
//   [selectFolders, (_state: RootState, ownerId: string | undefined) => ownerId],
//   (folders, ownerId) =>
//     ownerId ? folders.filter((f) => f.ownerId === ownerId) : [],
// );
// in foldersSlice.ts
export const selectFolderCount = (state: RootState) =>
  Object.values(state.folders.entities).length;
export default foldersSlice.reducer;
