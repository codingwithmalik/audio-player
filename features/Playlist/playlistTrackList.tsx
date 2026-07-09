"use client";

/**
 * PlaylistTrackList
 * -----------------
 * Column header + list of rows.
 * No overflow here — scroll is handled by the OverlayScrollbars wrapper in the page.
 *
 * playlistSongs: PlaylistSong[]
 *   Join records from the Playlist — carries addedAt per song.
 *   Parallel array to songs[], same order.
 *
 * likedSongIds: Set<string>
 *   Which songs the current user has liked.
 *   Pass from your liked songs state (future feature).
 */

import { Clock } from "lucide-react";
import PlaylistTrackRow from "./playlistTrackRow";
import { Song } from "@/types/song";
import { PlaylistSong } from "@/types/playlist";

interface PlaylistTrackListProps {
  songs: Song[];
  playlistSongs: PlaylistSong[]; // parallel array — carries addedAt per song
  currentSongId: string | null;
  onPlaySong: (songId: string, index: number) => void;
  isPlaylistPlaying: boolean;
  isCurrentPlaylist: boolean;
}

export default function PlaylistTrackList({
  songs,
  playlistSongs,
  currentSongId,
  isPlaylistPlaying,
  onPlaySong,
  isCurrentPlaylist,
}: PlaylistTrackListProps) {
  if (songs.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-white/40 text-sm">
        No songs in this playlist yet.
      </div>
    );
  }
  return (
    <div role="table" aria-label="Playlist tracks" className="w-full px-2">
      {/* Column header */}
      <div
        role="row"
        className="hidden sm:grid items-center gap-4 px-4 pb-2 mb-1 border-b border-white/10 sm:grid-cols-[32px_1.5fr_20px_1fr_48px_32px]  "
      >
        <span className="text-xs text-white/40 text-center font-semibold">
          #
        </span>
        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
          Title
        </span>
        <span></span>
        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
          Date added
        </span>
        <span className="flex justify-end">
          <Clock className="w-4 h-4 text-white/40" />
        </span>
        <span /> {/* more button column */}
      </div>
      {/* Rows */}
      <div role="rowgroup" className="flex flex-col gap-0.5 mt-1">
        {songs.map((song, i) => (
          <div key={song.id} data-gsap="track-row">
            <PlaylistTrackRow
              song={song}
              index={i + 1}
              addedAt={playlistSongs[i]?.addedAt ?? song.createdAt}
              isPlaying={isPlaylistPlaying && song.id === currentSongId}
              isCurrent={isCurrentPlaylist && song.id === currentSongId}
              onPlay={() => onPlaySong(song.id, i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
