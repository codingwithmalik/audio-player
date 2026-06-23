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
  likedSongIds: Set<string>;
  currentSongId: string | null;
  onPlaySong: (songId: string, index: number) => void;
  onLikeSong: (songId: string) => void;
  isPlaylistPlaying:boolean

}

export default function PlaylistTrackList({
  songs,
  playlistSongs,
  currentSongId,
  isPlaylistPlaying,
  likedSongIds,
  onPlaySong,
  onLikeSong,
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
        className="grid items-center gap-4 px-4 pb-2 mb-1 border-b border-white/10"
        style={{
          gridTemplateColumns: "32px 1.5fr 1fr  48px 32px",
        }}
      >
        <span className="text-xs text-white/40 text-center font-semibold">
          #
        </span>
        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">
          Title
        </span>
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
              isLiked={likedSongIds.has(song.id)}
              onPlay={() => onPlaySong(song.id, i)}
              onLike={() => onLikeSong(song.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
