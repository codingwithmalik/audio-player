/**
 * playlistsSlice
 * --------------
 * Normalized cache of all Playlist objects + UI state for the playlist page.
 *
 * UI state (search, sort, view) lives here so selectors can derive
 * filteredSongs without any logic in components — same pattern as librarySlice.
 */

import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Playlist, PlaylistSong } from "@/types/playlist";
import { Song } from "@/types/song";
import type { RootState } from "@/store/store";

// ─── Types ────────────────────────────────────────────────────────────────────

type FetchStatus = "idle" | "loading" | "done" | "error";

export type SortBy =
  | "custom"
  | "title"
  | "artist"
  | "recentlyAdded"
  | "duration";

export type SortDir = "asc" | "desc";
export type ViewMode = "list" | "grid";

interface PlaylistsState {
  entities: Record<string, Playlist>;
  fetchStatus: Record<string, FetchStatus>;
  error: string | null;
  // ── UI state ──
  searchQuery: string;
  sortBy: SortBy;
  sortDir: SortDir;
  viewMode: ViewMode;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: PlaylistsState = {
  entities: {},
  fetchStatus: {},
  error: null,
  searchQuery: "",
  sortBy: "custom",
  sortDir: "asc",
  viewMode: "list",
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    // ── Entity actions ────────────────────────────────────────────────────────

    upsertPlaylists(state, action: PayloadAction<Playlist[]>) {
      for (const playlist of action.payload) {
        state.entities[playlist.id] = playlist;
        state.fetchStatus[playlist.id] = "done";
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

    // in reducers:
    ensureLikedPlaylist(
      state,
      action: PayloadAction<{ userId: string; username: string }>,
    ) {
      const { userId } = action.payload;
      const likedId = `liked-${userId}`;

      // Already exists — do nothing
      if (state.entities[likedId]) return;

      const now = new Date().toISOString();
      state.entities[likedId] = {
        id: likedId,
        type: "playlist",
        title: "Liked Songs",
        description: "",
        coverImage: "",
        songs: [],
        folderId: null,
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      };
      state.fetchStatus[likedId] = "done";
    },

    // in playlistsSlice.ts — add to reducers

    addSongsToPlaylist(
      state,
      action: PayloadAction<{
        targetPlaylistId: string;
        songs: PlaylistSong[];
      }>,
    ) {
      const target = state.entities[action.payload.targetPlaylistId];
      if (!target) return;

      const existingIds = new Set(target.songs.map((s) => s.songId));

      for (const song of action.payload.songs) {
        if (existingIds.has(song.songId)) continue; // skip duplicates
        target.songs.push({
          songId: song.songId,
          addedAt: new Date().toISOString(), // fresh timestamp for the new playlist
        });
        existingIds.add(song.songId);
      }

      target.updatedAt = new Date().toISOString();
    },

    addSongToPlaylist(
      state,
      action: PayloadAction<{ playlistId: string; songId: string }>,
    ) {
      const playlist = state.entities[action.payload.playlistId];
      if (!playlist) return;
      if (playlist.songs.some((s) => s.songId === action.payload.songId))
        return;
      const entry: PlaylistSong = {
        songId: action.payload.songId,
        addedAt: new Date().toISOString(),
      };
      playlist.songs.push(entry);
      playlist.updatedAt = new Date().toISOString();
    },

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...updates } = action.payload;
      Object.assign(playlist, updates);
      playlist.updatedAt = new Date().toISOString();
    },

    removePlaylist(state, action: PayloadAction<string>) {
      delete state.entities[action.payload];
      delete state.fetchStatus[action.payload];
    },

    addPlaylist: {
      reducer(state, action: PayloadAction<Playlist>) {
        state.entities[action.payload.id] = action.payload;
        state.fetchStatus[action.payload.id] = "done";
      },
      prepare({ title, ownerId }: { title: string; ownerId: string }) {
        const now = new Date().toISOString();
        return {
          payload: {
            id: crypto.randomUUID(),
            type: "playlist" as const,
            title,
            description: "",
            coverImage: "",
            songs: [],
            folderId: null,
            ownerId,
            createdAt: now,
            updatedAt: now,
          },
        };
      },
    },
    
    setPlaylistFolder(
      state,
      action: PayloadAction<{ playlistId: string; folderId: string | null }>,
    ) {
      const playlist = state.entities[action.payload.playlistId];
      if (!playlist) return;
      playlist.folderId = action.payload.folderId;
      playlist.updatedAt = new Date().toISOString();
    },
    // ── UI actions ────────────────────────────────────────────────────────────

    /** Update the search query for the active playlist page. */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },

    /**
     * Set sort field. If the same field is clicked again, toggle direction.
     * Custom order has no direction — resets sortDir to "asc".
     */
    setSortBy(state, action: PayloadAction<SortBy>) {
      if (action.payload === "custom") {
        state.sortBy = "custom";
        state.sortDir = "asc";
        return;
      }
      if (state.sortBy === action.payload) {
        // same field → toggle direction
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = action.payload;
        state.sortDir = "asc";
      }
    },

    /** Toggle between list and grid view. */
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },

    /** Reset all UI state when leaving a playlist page. */
    resetPlaylistUI(state) {
      state.searchQuery = "";
      state.sortBy = "custom";
      state.sortDir = "asc";
      state.viewMode = "list";
    },
    // updates accessed at when any song is played from playlist
    touchPlaylist(state, action: PayloadAction<string>) {
      const playlist = state.entities[action.payload];
      if (playlist) playlist.accessedAt = new Date().toISOString();
    },
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const {
  upsertPlaylists,
  setFetchStatus,
  setError,
  ensureLikedPlaylist,
  addSongToPlaylist,
  addSongsToPlaylist,
  removeSongFromPlaylist,
  reorderPlaylistSongs,
  updatePlaylistMeta,
  setPlaylistFolder,
  removePlaylist,
  setSearchQuery,
  setSortBy,
  setViewMode,
  resetPlaylistUI,
  addPlaylist,
  touchPlaylist,
} = playlistsSlice.actions;

// ─── Base selectors ───────────────────────────────────────────────────────────

export const selectPlaylists = createSelector(
  [(state: RootState) => state.playlists.entities],
  (entities) => Object.values(entities),
);

export const selectPlaylistById = (state: RootState, id: string) =>
  state.playlists.entities[id] ?? null;

export const selectPlaylistSongCovers = createSelector(
  [
    (_: RootState, playlist?: Playlist) => playlist,
    (state: RootState) => state.songs.entities,
  ],
  (playlist, songs) =>
    (playlist?.songs.slice(0, 4) ?? []).map((s) => songs[s.songId]?.coverImage),
);

export const selectPlaylistFetchStatus = (
  state: RootState,
  id: string,
): FetchStatus => state.playlists.fetchStatus[id] ?? "idle";

export const selectPlaylistsError = (state: RootState) => state.playlists.error;

export const selectSearchQuery = (state: RootState) =>
  state.playlists.searchQuery;

export const selectSortBy = (state: RootState) => state.playlists.sortBy;
export const selectSortDir = (state: RootState) => state.playlists.sortDir;
export const selectViewMode = (state: RootState) => state.playlists.viewMode;

// in playlistsSlice.ts
export const selectPlaylistCount = (state: RootState) =>
  Object.values(state.playlists.entities).length;

export const selectIsLiked = (state: RootState, songId: string): boolean => {
  const userId = state.auth.user?.id;
  if (!userId) return false;
  const likedPlaylist = state.playlists.entities[`liked-${userId}`];
  if (!likedPlaylist) return false;
  return likedPlaylist.songs.some((s) => s.songId === songId);
};
export const selectLikedPlaylistId = (state: RootState): string | null => {
  const userId = state.auth.user?.id;
  return userId ? `liked-${userId}` : null;
};

// ─── selectFilteredSongs ──────────────────────────────────────────────────────
/**
 * The primary derived selector for the playlist page.
 * Takes the resolved Song[] (already joined from songsSlice) and applies
 * search filter + sort based on current UI state.
 *
 * Usage in page:
 *   const songs = useAppSelector(s => selectSongsByIds(s, songIds))
 *   const filtered = useAppSelector(s => selectFilteredSongs(s, songs))
 */
export const selectFilteredSongs = createSelector(
  [
    (state: RootState) => state.playlists.searchQuery,
    (state: RootState) => state.playlists.sortBy,
    (state: RootState) => state.playlists.sortDir,
    (_state: RootState, songs: Song[]) => songs,
  ],
  (searchQuery, sortBy, sortDir, songs): Song[] => {
    // ── 1. Filter ──
    let result = songs;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = songs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artists.some((a) => a.toLowerCase().includes(q)),
      );
    }

    // ── 2. Sort ──
    if (sortBy === "custom") return result; // preserve playlist order

    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "artist":
          cmp = a.artists[0].localeCompare(b.artists[0]);
          break;
        case "recentlyAdded":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "duration":
          cmp = a.duration - b.duration;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  },
);

export default playlistsSlice.reducer;
