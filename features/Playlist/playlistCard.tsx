"use client";

/**
 * app/playlist/[id]/page.tsx
 * --------------------------
 * Renders a single playlist page.
 *
 * ── Redux wiring (replace mock data with these when slices are ready) ────────
 *
 *   const { id } = useParams<{ id: string }>()
 *
 *   const playlist = useAppSelector(s => selectPlaylistById(s, id))
 *   const songs    = useAppSelector(s =>
 *     selectSongsByIds(s, playlist?.songs.map(s => s.songId) ?? [])
 *   )
 *
 *   const currentSongId    = useAppSelector(s => s.player.currentEntry?.songId ?? null)
 *   const isPlaylistPlaying = useAppSelector(s =>
 *     s.player.isPlaying && s.queue.source?.id === id
 *   )
 *
 *   const dispatch = useAppDispatch()
 *
 *   const handlePlay = () => {
 *     const entries = buildQueueEntries(songs, { type: 'playlist', id, label: playlist.title })
 *     dispatch(setQueue(entries))
 *     dispatch(setCurrentSong(entries[0]))
 *     dispatch(setIsPlaying(true))
 *   }
 *
 *   const handlePlaySong = (songId: string, index: number) => {
 *     const entries = buildQueueEntries(songs, { type: 'playlist', id, label: playlist.title })
 *     dispatch(setQueue(entries))
 *     dispatch(setCurrentIndex(index))
 *     dispatch(setCurrentSong(entries[index]))
 *     dispatch(setIsPlaying(true))
 *   }
 *
 *   const handleLikeSong = (songId: string) => {
 *     // dispatch your like action here
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useCallback } from "react";
import { useParams }   from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";

import PlaylistView from "./playlistView";
import { Playlist } from "@/types/playlist";
import { Song }     from "@/types/song";

// ─── Mock data — swap with Redux selectors ────────────────────────────────────

const MOCK_PLAYLIST: Playlist = {
  id: "gym",
  type: "playlist",
  title: "GYM",
  description: undefined,
  // coverImage: undefined,   // no cover → mosaic will be used
    coverImage: "https://picsum.photos/seed/darkside/600/600",
  songs: [
    { songId: "s1", addedAt: "2025-09-24T00:00:00Z" },
    { songId: "s2", addedAt: "2025-10-11T00:00:00Z" },
    { songId: "s3", addedAt: "2025-10-11T00:00:00Z" },
    { songId: "s4", addedAt: "2025-08-01T00:00:00Z" },
    { songId: "s5", addedAt: "2025-07-15T00:00:00Z" },
    { songId: "s6", addedAt: "2025-06-30T00:00:00Z" },
  ],
  folderId: null,
  ownerId: "user-1",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-10-11T00:00:00Z",
};

const MOCK_SONGS: Song[] = [
  {
    id: "s1", title: "DARKSIDE",
    artists: ["Neoni"],
    coverImage: "https://picsum.photos/seed/darkside/600/600",
    audioUrl: "", duration: 168,
    uploadedBy: "user-1",
    createdAt: "2025-09-24T00:00:00Z", updatedAt: "2025-09-24T00:00:00Z",
  },
  {
    id: "s2", title: "LUNA BALA - Slowed",
    artists: ["Yb Wasg'ood", "Ariis", "MC PR"],
    coverImage: "https://picsum.photos/seed/luna/600/600",
    audioUrl: "", duration: 124,
    uploadedBy: "user-1",
    createdAt: "2025-10-11T00:00:00Z", updatedAt: "2025-10-11T00:00:00Z",
  },
  {
    id: "s3", title: "GLORY",
    artists: ["Ogryzek"],
    coverImage: "https://picsum.photos/seed/glory/600/600",
    audioUrl: "", duration: 149,
    uploadedBy: "user-1",
    createdAt: "2025-10-11T00:00:00Z", updatedAt: "2025-10-11T00:00:00Z",
  },
  {
    id: "s4", title: "Bad Guy",
    artists: ["Billie Eilish"],
    coverImage: "https://picsum.photos/seed/badguy/600/600",
    audioUrl: "", duration: 194,
    uploadedBy: "user-2",
    createdAt: "2025-08-01T00:00:00Z", updatedAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "s5", title: "HIGHEST IN THE ROOM",
    artists: ["Travis Scott"],
    coverImage: "https://picsum.photos/seed/highest/600/600",
    audioUrl: "", duration: 176,
    uploadedBy: "user-2",
    createdAt: "2025-07-15T00:00:00Z", updatedAt: "2025-07-15T00:00:00Z",
  },
  {
    id: "s6", title: "Blinding Lights",
    artists: ["The Weeknd"],
    coverImage: "https://picsum.photos/seed/blinding/600/600",
    audioUrl: "", duration: 200,
    uploadedBy: "user-2",
    createdAt: "2025-06-30T00:00:00Z", updatedAt: "2025-06-30T00:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function PlaylistPage() {
  // const { id } = useParams<{ id: string }>();    // uncomment with Redux

  const playlist          = MOCK_PLAYLIST;
  const songs             = MOCK_SONGS;
  const likedSongIds      = new Set<string>(["s2", "s5"]);
  const currentSongId     = null as string | null;
  const isPlaylistPlaying = false;

  // ── Duration label ──
  const totalSecs = songs.reduce((acc, s) => acc + s.duration, 0);
  const hrs  = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const durationLabel = hrs > 0 ? `about ${hrs} hr ${mins} min` : `about ${mins} min`;

  // ── Handlers ──
  const handlePlay = useCallback(() => {
    console.log("play playlist");
    // dispatch logic goes here
  }, []);

  const handleShuffle = useCallback(() => {
    console.log("shuffle playlist");
  }, []);

  const handlePlaySong = useCallback((songId: string, index: number) => {
    console.log("play song", songId, index);
  }, []);

  const handleLikeSong = useCallback((songId: string) => {
    console.log("like song", songId);
  }, []);

  return (
    /*
     * Single OverlayScrollbars root — no overflow anywhere inside PlaylistView.
     * Same pattern as LeftSidebar.
     */
    <OverlayScrollbarsComponent
      className="h-full w-full rounded-md glass"
      options={{
        scrollbars: { theme: "os-theme-dark", autoHide: "move" },
        overflow:   { x: "hidden", y: "scroll" },
      }}
      defer
    >
      <PlaylistView
        playlist={playlist}
        songs={songs}
        playlistSongs={playlist.songs}
        likedSongIds={likedSongIds}
        ownerName="CodingWithMalik"
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