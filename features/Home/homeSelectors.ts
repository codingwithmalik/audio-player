import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { HomeSection } from "./homeTypes";
import {
  getTopGenresFromHistory,
  getRecommendedSongs,
  getPopularSongs,
} from "@/utils/recommendationUtils";

// const YOUR_PLAYLISTS_LIMIT = 8;
// const JUMP_BACK_IN_LIMIT = 8;
// const RECENTS_LIMIT = 8;
// const MADE_FOR_YOU_LIMIT = 10;
// const NEW_RELEASES_LIMIT = 10;
const TOP_GENRES_LIMIT = 5;

export const SHELF_LIMITS: Record<string, number> = {
  "your-playlists": 8,
  "jump-back-in": 8,
  "recents": 8,
  "made-for-you": 10,
  "new-releases": 10,
};

const FULL_LIMITS: Record<string, number> = Object.fromEntries(
  Object.entries(SHELF_LIMITS).map(([id, limit]) => [id, limit * 2])
);


export const selectHomeSections = createSelector(
  [
    (state: RootState) => state.playlists.entities,
    (state: RootState) => state.songs.entities,
    (state: RootState) => state.history.recentSongIds,
    (state: RootState) => state.auth.user?.id,
  ],
  (playlistsById, songsById, recentSongIds, userId): HomeSection[] => {
    const ownedPlaylists = Object.values(playlistsById).filter(
      (p) => p.ownerId === userId
    );

    // ── Your playlists: all owned, accessedAt (fallback createdAt) desc ──
    const yourPlaylists = [...ownedPlaylists]
      .sort((a, b) => {
        const aTime = new Date(a.accessedAt ?? a.createdAt).getTime();
        const bTime = new Date(b.accessedAt ?? b.createdAt).getTime();
        return bTime - aTime;
      })
      .slice(0, FULL_LIMITS["your-playlists"]);

    // ── Jump back in: recently played songs, already most-recent-first ──
    const jumpBackInIds = recentSongIds.slice(0, FULL_LIMITS["jump-back-in"]);

    // ── Recents: only playlists actually played, accessedAt desc ──
    const recentPlaylists = ownedPlaylists
      .filter((p) => !!p.accessedAt)
      .sort(
        (a, b) => new Date(b.accessedAt!).getTime() - new Date(a.accessedAt!).getTime()
      )
      .slice(0, FULL_LIMITS["recents"]);

    // ── Made for you: genre-based recommendation, falls back to popular ──
    const historyEntries = recentSongIds.map((songId) => ({ songId }));
    const topGenres = getTopGenresFromHistory(historyEntries, songsById, TOP_GENRES_LIMIT);
    const excludeIds = new Set(recentSongIds);

    let madeForYouSongs = getRecommendedSongs(songsById, topGenres, excludeIds, FULL_LIMITS["made-for-you"]);
    if (madeForYouSongs.length === 0) {
      madeForYouSongs = getPopularSongs(songsById, excludeIds, FULL_LIMITS["made-for-you"]);
    }

    // ── New releases: all songs, createdAt desc ──
    const newReleases = Object.values(songsById)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, FULL_LIMITS["new-releases"]);

    return [
      {
        id: "your-playlists",
        title: "Your Playlists",
        source: "playlists",
        itemType: "playlist",
        itemIds: yourPlaylists.map((p) => p.id),
      },
      {
        id: "jump-back-in",
        title: "Jump Back In",
        source: "history",
        itemType: "song",
        itemIds: jumpBackInIds,
      },
      {
        id: "recents",
        title: "Recents",
        source: "history",
        itemType: "playlist",
        itemIds: recentPlaylists.map((p) => p.id),
      },
      {
        id: "made-for-you",
        title: "Made For You",
        source: "madeForYou",
        itemType: "song",
        itemIds: madeForYouSongs.map((s) => s.id),
      },
      {
        id: "new-releases",
        title: "New Releases",
        source: "newReleases",
        itemType: "song",
        itemIds: newReleases.map((s) => s.id),
      },
    ];
  }
);