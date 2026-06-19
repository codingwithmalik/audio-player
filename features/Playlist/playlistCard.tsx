"use client";

/**
 * playlistCard.tsx
 * ----------------
 * Playlist detail page — owns all state and handlers.
 * search/sort/view state lives in Redux (playlistsSlice UI state).
 * selectFilteredSongs selector handles all filtering + sorting.
 */

import { useEffect, useCallback} from "react";
import { useParams } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  upsertPlaylists,
  selectPlaylistById,
  selectFilteredSongs,
  resetPlaylistUI,
} from "@/features/Playlist/playlistSlice";
import { upsertSongs, selectSongsByIds } from "@/features/Songs/songsSlice";
import { playlists,songs as mocksongs } from "@/lib/mockData";

import PlaylistView from "./playlistView";

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // ── Load mock data on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    dispatch(upsertPlaylists(playlists));
    dispatch(upsertSongs(mocksongs));
    // Reset search/sort/view when navigating to a new playlist
    return () => { dispatch(resetPlaylistUI()); };
  }, [id, dispatch]);

  // ── Read entities from store ────────────────────────────────────────────────
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));

  // ── Filtered + sorted songs via selector ───────────────────────────────────
  const filteredSongs = useAppSelector((s) => selectFilteredSongs(s, songs));

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalSecs = songs.reduce((total, s) => total + s.duration, 0);
  const hrs  = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);
  const durationLabel =
    hrs > 0 ? `about ${hrs} hr ${mins} min` : `${mins} min ${secs} seconds`;

  // Hardcoded until auth + liked-songs slices are built
  const likedSongIds = new Set<string>(["s2", "s5"]);
  const isPlaylistPlaying = false;

  // ── Playback handlers ───────────────────────────────────────────────────────
  const handlePlaySong = useCallback((songId: string, index: number) => {
    console.log("play song", songId, "at index", index);
  }, []);

  const handleLikeSong = useCallback((songId: string) => {
    console.log("like song", songId);
  }, []);



  // ── Loading state ───────────────────────────────────────────────────────────
  if (!playlist) {
    return (
      <div className="h-full w-full flex items-center justify-center glass rounded-md">
        <span className="text-white/40 text-sm">Loading playlist...</span>
      </div>
    );
  }

  return (
    <OverlayScrollbarsComponent
      className="h-full w-full rounded-md glass"
      options={{
        scrollbars: { theme: "os-theme-dark", autoHide: "move" },
        overflow: { x: "hidden", y: "scroll" },
      }}
      defer
    >
      <PlaylistView
        playlist={playlist}
        songs={songs}
        filteredSongs={filteredSongs}
        likedSongIds={likedSongIds}
        totalDurationLabel={durationLabel}
        accentColor="#8B1A1A"
        isPlaylistPlaying={isPlaylistPlaying}
        onPlaySong={handlePlaySong}
        onLikeSong={handleLikeSong}
      />
    </OverlayScrollbarsComponent>
  );
}