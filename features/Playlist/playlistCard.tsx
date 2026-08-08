"use client";

import { useCallback, useEffect } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylistById,
  selectFilteredSongs,
  resetPlaylistUI,
} from "@/features/Playlist/playlistSlice";
import PlaylistView from "./playlistView";
import PlaylistViewSkeleton from "./Animations/PlaylistViewSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";
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
import { useGetSongsByIdsQuery } from "@/features/Songs/songsApi";
import { useGetPlaylistQuery } from "@/features/Playlist/playlistsApi";

export default function PlaylistPage({ id }: { id: string }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;
    return () => {
      dispatch(resetPlaylistUI());
      dispatch(closeRightSidebarPanel());
    };
  }, [id, dispatch]);

  const {
    isLoading: playlistLoading,
    isError: playlistError,
    refetch: refetchPlaylist,
  } = useGetPlaylistQuery(id);
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));

  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const {
    data: songs = [],
    isLoading: songsLoading,
    isError: songsError,
    refetch: refetchSongs,
  } = useGetSongsByIdsQuery(songIds, { skip: songIds.length === 0 });

  const currentSongId = useAppSelector(selectCurrentSongId);
  const sourceId = useAppSelector(selectQueueSourceId);
  const sourceType = useAppSelector(selectQueueSourceType);
  const filteredSongs = useAppSelector((s) => selectFilteredSongs(s, songs));

  const totalSecs = songs.reduce((total, s) => total + s.duration, 0);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);
  const durationLabel =
    hrs > 0 ? `about ${hrs} hr ${mins} min` : `${mins} min ${secs} seconds`;

  const isplaying = useAppSelector(selectIsPlaying);
  const isPlaylistPlaying =
    isplaying && sourceType === "playlist" && sourceId === id;
  const isCurrentPlaylist = sourceType === "playlist" && sourceId === id;

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

  if (playlistError) {
    return (
      <div className="h-full w-full glass rounded-md">
        <ErrorState
          message="Couldn't load this playlist."
          onRetry={refetchPlaylist}
        />
      </div>
    );
  }

  // Loading and "genuinely not found" used to share one !playlist check —
  // same fix as FolderView, so a fresh page load doesn't flash "not found."
  const isInitialLoading =
    playlistLoading || !playlist || (songIds.length > 0 && songsLoading);

  if (isInitialLoading) {
    return (
      <div className="h-full w-full rounded-md glass overflow-hidden">
        <PlaylistViewSkeleton />
      </div>
    );
  }

  if (songsError) {
    return (
      <div className="h-full w-full glass rounded-md">
        <ErrorState
          message="Couldn't load songs for this playlist."
          onRetry={refetchSongs}
        />
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
