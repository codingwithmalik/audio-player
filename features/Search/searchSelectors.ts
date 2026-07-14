import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { Song } from "@/types/song";

export const selectSearchResults = createSelector(
  [
    (state: RootState) => state.songs.entities,
    (_: RootState, query: string) => query,
  ],
  (songsById, query): Song[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.values(songsById).filter(
      (song) =>
        song.title.toLowerCase().includes(q) ||
        song.artists.some((artist) => artist.toLowerCase().includes(q))
    );
  }
);

export const selectRecentSearchSongs = createSelector(
  [
    (state: RootState) => state.search.recentSearches,
    (state: RootState) => state.songs.entities,
  ],
  (recentIds, songsById): Song[] =>
    recentIds.map((id) => songsById[id]).filter((s): s is Song => !!s)
);