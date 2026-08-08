import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { HomeSection } from "./homeTypes";

// Shelf sizes for the home tab only. Full-view pagination for song sections
// (jump-back-in, new-releases, made-for-you) is handled directly in
// HomeSections via dedicated paginated queries — it doesn't go through this
// selector at all. Playlist sections (your-playlists, recents) are
// deliberately uncapped everywhere: they're bounded by what the user
// actually owns, not by the catalog size.
export const SHELF_LIMITS: Record<string, number> = {
  "your-playlists": 8,
  "jump-back-in": 8,
  recents: 8,
  "made-for-you": 10,
  "new-releases": 10,
};

export const selectHomeSections = createSelector(
  [
    (state: RootState) => state.playlists.entities,
    (state: RootState) => state.songs.entities,
    (state: RootState) => state.history.recentSongIds,
  ],
  (playlistsById, songsById, recentSongIds): HomeSection[] => {
    const ownedPlaylists = Object.values(playlistsById).filter(
      (p) => !p.deletedAt,
    );

    // ── Your playlists: all owned, accessedAt (fallback createdAt) desc.
    // Uncapped — full view should show literally everything the user owns. ──
    const yourPlaylists = [...ownedPlaylists].sort((a, b) => {
      const aTime = new Date(a.accessedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.accessedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });

    // ── Jump back in: full history, most-recent-first. The shelf slices what
    // it needs (see SHELF_LIMITS); full view paginates separately in the
    // component using this same underlying list, no extra fetch needed since
    // history is already fully loaded client-side. ──
    const jumpBackInIds = recentSongIds;

    // ── Recents: only playlists actually played, accessedAt desc. Uncapped,
    // same reasoning as Your Playlists. ──
    const recentPlaylists = ownedPlaylists
      .filter((p) => !!p.accessedAt)
      .sort(
        (a, b) =>
          new Date(b.accessedAt!).getTime() - new Date(a.accessedAt!).getTime(),
      );

    // ── New releases: whatever's currently in the songs cache, sorted
    // newest-first. This is only correct because every fetch that populates
    // this cache uses skip:0 with a growing limit — never skip>0 — which
    // guarantees it's always a real, gap-free prefix of the true sort order,
    // regardless of which component's fetch actually put a given song here. ──
    const newReleases = Object.values(songsById).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

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
        itemIds: [], // filled directly from the recommendations query in HomeSections
      },
      {
        id: "new-releases",
        title: "New Releases",
        source: "newReleases",
        itemType: "song",
        itemIds: newReleases.map((s) => s.id),
      },
    ];
  },
);
