"use client";

/**
 * playlistCard.tsx
 * ----------------
 * Playlist detail page — owns all state and handlers.
 * search/sort/view state lives in Redux (playlistsSlice UI state).
 * selectFilteredSongs selector handles all filtering + sorting.
 */

import { useCallback, useEffect } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylistById,
  selectFilteredSongs,
  resetPlaylistUI,
} from "@/features/Playlist/playlistSlice";
import { selectSongsByIds } from "@/features/Songs/songsSlice";
import PlaylistView from "./playlistView";
import {
  setSong,
  selectIsPlaying,
  togglePlay,
  selectCurrentSongId,
} from "@/slices/playerSlice";
import {
  setCurrentIndex,
  setQueue,
  selectQueueSourceId,
  selectQueueSourceType,
} from "../RightSidebar/Queue/queueSlice";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";

export default function PlaylistPage({ id }: { id: string }) {
  // console.log("Playlist found : "+id)
  const dispatch = useAppDispatch();

  // ── Load mock data on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    // Reset search/sort/view when navigating to a new playlist
    return () => {
      dispatch(resetPlaylistUI());
      dispatch(closeRightSidebarPanel())
    };
  }, [id, dispatch]);

  // ── Read entities from store ────────────────────────────────────────────────
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));
  const currentSongId = useAppSelector(selectCurrentSongId);
  const sourceId = useAppSelector(selectQueueSourceId);
  const sourceType = useAppSelector(selectQueueSourceType);
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
  const isCurrentPlaylist = sourceType === "playlist" && sourceId === id;
  // console.log(sourceId, sourceType, isplaying, isPlaylistPlaying);
  // const isPlaylistPlaying = false;
  // ── Playback handlers ───────────────────────────────────────────────────────
  const handlePlaySong = useCallback(
    (songId: string, index: number) => {
      if (songId === currentSongId) {
        dispatch(togglePlay());
        return;
      }
      dispatch(
        setQueue({
          songIds: songs.map((s) => s.id),
          sourceType: "playlist",
          sourceId: id,
        }),
      );
      dispatch(setCurrentIndex(index));
      dispatch(setSong(songId));
    },
    [dispatch, songs, id, currentSongId],
  );

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
        totalDurationLabel={durationLabel}
        isPlaylistPlaying={isPlaylistPlaying}
        isCurrentPlaylist={isCurrentPlaylist}
        onPlaySong={handlePlaySong}
      />
    </OverlayScrollbarsComponent>
  );
}
