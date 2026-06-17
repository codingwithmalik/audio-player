/**
 * playlistsSlice
 * --------------
 * Normalized cache of all Playlist objects the app has fetched.
 *
 * Shape:
 *   entities: Record<id, Playlist>   ← the source of truth
 *   fetchStatus: Record<id, Status>  ← loading state co-located with its data
 *   error: string | null
 *
 * Rules:
 *   - Never store Song objects here. Only PlaylistSong join records live on the Playlist.
 *   - To resolve songs, select from songsSlice via selectSongsByIds selector.
 *   - Components never mutate entities directly — always dispatch an action.
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playlist, PlaylistSong } from "@/types/playlist";
import type { RootState } from "@/store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

type FetchStatus = "idle" | "loading" | "done" | "error";

interface PlaylistsState {
  entities: Record<string, Playlist>;
  fetchStatus: Record<string, FetchStatus>;
  error: string | null ;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: PlaylistsState = {
  entities: {},
  fetchStatus: {},
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    /**
     * Upsert one or many playlists into the cache.
     * Used when API response comes back with playlist data.
     */
    upsertPlaylists(state, action: PayloadAction<Playlist[]>) {
      for (const playlist of action.payload) {
        state.entities[playlist.id] = playlist;
        state.fetchStatus[playlist.id] = "done";
      }
    },

    /** Mark a single playlist as loading (before fetch starts). */
    setFetchStatus(
      state,
      action: PayloadAction<{ id: string; status: FetchStatus }>,
    ) {
      state.fetchStatus[action.payload.id] = action.payload.status;
    },

    /** Store a fetch error message. */
    setError(state, action: PayloadAction<string | null >) {
      state.error = action.payload;
    },

    /**
     * Add a song to a playlist (e.g. user adds a song from search).
     * Appends a PlaylistSong join record to the END of songs[].
     */
    addSongToPlaylist(
      state,
      action: PayloadAction<{ playlistId: string; songId: string }>,
    ) {
      const playlist = state.entities[action.payload.playlistId];
      if (!playlist) return;
      // no dupes
      if (playlist.songs.some((s) => s.songId === action.payload.songId))
        return;
      const entry: PlaylistSong = {
        songId: action.payload.songId,
        addedAt: new Date().toISOString(),
      };
      playlist.songs.push(entry);
      playlist.updatedAt = new Date().toISOString();
    },

    /**
     * Remove a song from a playlist.
     */
    removeSongFromPlaylist(
      state,
      action: PayloadAction<{ playlistId: string; songId: string }>,
    ) {
      const playlist = state.entities[action.payload.playlistId];
      if (!playlist) return;
      playlist.songs = playlist.songs.filter(
        (s) => s.songId !== action.payload.songId,
      );
      playlist.updatedAt = new Date().toISOString();
    },

    /**
     * Reorder songs within a playlist by moving one index to another.
     * Used for drag-and-drop reordering in the track list.
     */
    reorderPlaylistSongs(
      state,
      action: PayloadAction<{
        playlistId: string;
        fromIndex: number;
        toIndex: number;
      }>,
    ) {
      const playlist = state.entities[action.payload.playlistId];
      if (!playlist) return;
      const { fromIndex, toIndex } = action.payload;
      const songs = [...playlist.songs];
      const [moved] = songs.splice(fromIndex, 1);
      songs.splice(toIndex, 0, moved);
      playlist.songs = songs;
      playlist.updatedAt = new Date().toISOString();
    },

    /**
     * Update playlist metadata (title, description, coverImage).
     * Merges partial updates — only provided fields are changed.
     */
    updatePlaylistMeta(
      state,
      action: PayloadAction<
        { id: string } & Partial<
          Pick<Playlist, "title" | "description" | "coverImage">
        >
      >,
    ) {
      const playlist = state.entities[action.payload.id];
      if (!playlist) return;
      const { id, ...updates } = action.payload;
      Object.assign(playlist, updates);
      playlist.updatedAt = new Date().toISOString();
    },

    /**
     * Remove a playlist from the cache entirely.
     * Call this after a delete API call succeeds.
     */
    removePlaylist(state, action: PayloadAction<string>) {
      delete state.entities[action.payload];
      delete state.fetchStatus[action.payload];
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  upsertPlaylists,
  setFetchStatus,
  setError,
  addSongToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  updatePlaylistMeta,
  removePlaylist,
} = playlistsSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Get a single playlist by id. */
export const selectPlaylistById = (state: RootState, id: string) =>
  state.playlists.entities[id] ?? null;

/** Get fetch status for a playlist. */
export const selectPlaylistFetchStatus = (
  state: RootState,
  id: string,
): FetchStatus => state.playlists.fetchStatus[id] ?? "idle";

/** Get the error string. */
export const selectPlaylistsError = (state: RootState) => state.playlists.error;

export default playlistsSlice.reducer;
