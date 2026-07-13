/**
 * songsSlice
 * ----------
 * Normalized cache of all Song objects the app has fetched.
 *
 * Every other slice stores only songIds as references.
 * When a component needs the actual Song data it joins here via selectors.
 *
 * Key selector for the playlist page:
 *   selectSongsByIds(state, ids) → Song[]
 *   Returns songs in the ORDER of ids (playlist order is preserved).
 *   Extract ids from playlist like: playlist.songs.map(s => s.songId)
 */

import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "@/types/song";
import type { RootState } from "@/store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

type FetchStatus = "idle" | "loading" | "done" | "error";

interface SongsState {
  entities: Record<string, Song>;
  fetchStatus: Record<string, FetchStatus>;
  error: string | null;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: SongsState = {
  entities: {},
  fetchStatus: {},
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    /**
     * Upsert one or many songs into the cache.
     * Call this whenever API returns song data — search, playlist load, etc.
     */
    upsertSongs(state, action: PayloadAction<Song[]>) {
      for (const song of action.payload) {
        state.entities[song.id] = song;
        state.fetchStatus[song.id] = "done";
      }
    },

    /** Mark one song's fetch status (before/after API call). */
    setSongFetchStatus(
      state,
      action: PayloadAction<{ id: string; status: FetchStatus }>,
    ) {
      state.fetchStatus[action.payload.id] = action.payload.status;
    },

    /** Store a fetch error. */
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    /** Remove a song from the cache (e.g. after user deletes their upload). */
    removeSong(state, action: PayloadAction<string>) {
      delete state.entities[action.payload];
      delete state.fetchStatus[action.payload];
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const { upsertSongs, setSongFetchStatus, setError, removeSong } =
  songsSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

/** Single song by id. */
export const selectSongById = (state: RootState, id: string): Song | null =>
  state.songs.entities[id] ?? null;
export const selectSongs = createSelector(
  [(state: RootState) => state.songs.entities],
  (entities) => {
    return Object.values(entities);
  },
);
/** Fetch status for a song. */
export const selectSongFetchStatus = (
  state: RootState,
  id: string,
): FetchStatus => state.songs.fetchStatus[id] ?? "idle";

/**
 * selectSongsByIds
 * ----------------
 * The primary join selector used by the playlist page.
 * Returns Song[] in the SAME ORDER as the provided ids array.
 * Songs missing from the cache are filtered out (not yet fetched).
 *
 * Usage in page:
 *   const ids = playlist?.songs.map(s => s.songId) ?? []
 *   const songs = useAppSelector(s => selectSongsByIds(s, ids))
 */
export const selectSongsByIds = createSelector(
  [
    (state: RootState) => state.songs.entities,
    (_: RootState, ids: string[]) => ids,
  ],
  (entities, ids) =>
    ids.reduce<Song[]>((songs, id) => {
      const song = entities[id];
      if (song) songs.push(song);
      return songs;
    }, []),
);

export default songsSlice.reducer;
