"use client";

/**
 * playlistCard.tsx
 * ----------------
 * Playlist detail page.
 *
 * Data flow:
 *   1. useParams gets the playlist id from the slug
 *   2. useEffect fires on mount — loads mock data into Redux store
 *      (replace dispatch calls here with a real API thunk when backend is ready)
 *   3. useAppSelector reads playlist and songs from the store
 *   4. Resolved data flows down into PlaylistView as props
 *
 * When backend is ready:
 *   - Delete the useEffect body and replace with: dispatch(fetchPlaylistById(id))
 *   - Delete the mockData imports
 *   - Everything else stays the same
 */

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  upsertPlaylists,
  selectPlaylistById,
} from "@/features/Playlist/playlistSlice";
import { upsertSongs, selectSongsByIds } from "@/features/Songs/songsSlice";
import { selectUsernameById } from "@/features/Auth/authSlice";
import { playlists, songs as mockSongs } from "@/lib/mockData";

import PlaylistView from "./playlistView";

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // ── Step 1: Load mock data into store on mount ──────────────────────────
  // DELETE this useEffect body when backend is ready.
  // Replace with: dispatch(fetchPlaylistById(id))
  useEffect(() => {
    if (!id) return;
    dispatch(upsertPlaylists(playlists));
    dispatch(upsertSongs(mockSongs));
  }, [id, dispatch]);

  // ── Step 2: Read from store ─────────────────────────────────────────────
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));
  // console.log(playlist);
  const ownerId = playlist?.ownerId;
  const ownername = useAppSelector((s) => selectUsernameById(s, ownerId ?? ""));

  // ── Step 3: Derive computed values ──────────────────────────────────────
  const totalSecs = songs.reduce((total, s) => total + s.duration, 0);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);

  const durationLabel =
    hrs > 0 ? `about ${hrs} hr ${mins} min` : `${mins} min ${secs} seconds`;

  // Hardcoded for now — wire to auth slice when user system is built
  const likedSongIds = new Set<string>(["s2", "s5"]);
  const currentSongId = null as string | null;
  const isPlaylistPlaying = false;

  // ── Step 4: Handlers ────────────────────────────────────────────────────
  const handlePlay = useCallback(() => {
    // TODO: dispatch(setSong(...)) when playerSlice is updated
    console.log("play playlist", id);
  }, [id]);

  const handleShuffle = useCallback(() => {
    // TODO: dispatch(toggleShuffle()) + handlePlay()
    console.log("shuffle playlist", id);
  }, [id]);

  const handlePlaySong = useCallback((songId: string, index: number) => {
    // TODO: dispatch(setSong(...)) when playerSlice is updated
    console.log("play song", songId, "at index", index);
  }, []);

  const handleLikeSong = useCallback((songId: string) => {
    // TODO: dispatch like action when liked songs slice is built
    console.log("like song", songId);
  }, []);

  // ── Step 5: Loading state ───────────────────────────────────────────────
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
        playlistSongs={playlist.songs}
        likedSongIds={likedSongIds}
        ownerName={ownername}
        totalDurationLabel={durationLabel}
        accentColor="#8B1A1A"
        currentSongId={currentSongId}
        isPlaylistPlaying={isPlaylistPlaying}
        onPlay={handlePlay}
        onShuffle={handleShuffle}
        onPlaySong={handlePlaySong}
        onLikeSong={handleLikeSong}
      />
    </OverlayScrollbarsComponent>
  );
}
