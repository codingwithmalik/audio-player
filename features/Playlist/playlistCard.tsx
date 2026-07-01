"use client";

/**
 * playlistCard.tsx
 * ----------------
 * Playlist detail page — owns all state and handlers.
 * search/sort/view state lives in Redux (playlistsSlice UI state).
 * selectFilteredSongs selector handles all filtering + sorting.
 */

import { useCallback } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylistById,
  selectFilteredSongs,
} from "@/features/Playlist/playlistSlice";
import {  selectSongsByIds } from "@/features/Songs/songsSlice";
import PlaylistView from "./playlistView";
import {
  setSong,
  setSourceId,
  setSourceType,
  selectIsPlaying,
  selectSourceType,
  selectSourceId,
} from "@/store/playerSlice";

export default function PlaylistPage({id}:{id:string}) {
  // console.log("Playlist found : "+id)
  const dispatch = useAppDispatch();

  // ── Load mock data on mount ─────────────────────────────────────────────────
  // useEffect(() => {
  //   if (!id) return;
  //   // Reset search/sort/view when navigating to a new playlist
  //   return () => {
  //     dispatch(resetPlaylistUI());
  //   };
  // }, [id, dispatch]);

  // ── Read entities from store ────────────────────────────────────────────────
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));
  const sourceType = useAppSelector(selectSourceType);
  const sourceId = useAppSelector(selectSourceId);
  // ── Filtered + sorted songs via selector ───────────────────────────────────
  const filteredSongs = useAppSelector((s) => selectFilteredSongs(s, songs));

  // ── Derived values ──────────────────────────────────────────────────────────
  const totalSecs = songs.reduce((total, s) => total + s.duration, 0);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);
  const durationLabel =
    hrs > 0 ? `about ${hrs} hr ${mins} min` : `${mins} min ${secs} seconds`;

  // Checking is the playlistPlaying
  const isplaying = useAppSelector(selectIsPlaying);
  const isPlaylistPlaying =
    isplaying && sourceType === "playlist" && sourceId === id;
  // console.log(sourceId, sourceType, isplaying, isPlaylistPlaying);
  // Hardcoded until auth + liked-songs slices are built
  const likedSongIds = new Set<string>(["s2", "s5"]);
  // const isPlaylistPlaying = false;
  // ── Playback handlers ───────────────────────────────────────────────────────
  const handlePlaySong = useCallback(
    (songId: string) => {
      dispatch(setSong(songId));
      dispatch(setSourceId(id));
      dispatch(setSourceType("playlist"));
      // console.log("play song", songId, "at index", index);
    },
    [dispatch, id],
  );

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
        isPlaylistPlaying={isPlaylistPlaying}
        onPlaySong={handlePlaySong}
        onLikeSong={handleLikeSong}
      />
    </OverlayScrollbarsComponent>
  );
}
