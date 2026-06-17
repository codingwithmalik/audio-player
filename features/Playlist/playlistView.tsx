"use client";

/**
 * PlaylistView
 * ------------
 * Root composer. Assembles Hero → Actions → TrackList.
 * Render this inside an OverlayScrollbars wrapper in your page.
 *
 * GSAP entrance:
 *   hero slides up → actions slides up → track rows stagger in from left.
 *   Replays whenever playlist.id changes (navigating between playlists).
 */

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import PlaylistHero       from "./playlistHero";
import PlaylistActions    from "./playlistActions";
import PlaylistTrackList  from "./playlistTrackList";

import { Playlist, PlaylistSong } from "@/types/playlist";
import { Song }     from "@/types/song";

interface PlaylistViewProps {
  playlist: Playlist;
  songs: Song[];
  playlistSongs:PlaylistSong[]
  likedSongIds: Set<string>;
  ownerName: string;
  totalDurationLabel: string;
  accentColor?: string;
  currentSongId: string | null;
  isPlaylistPlaying: boolean;
  onPlay: () => void;
  onShuffle: () => void;
  onPlaySong: (songId: string, index: number) => void;
  onLikeSong: (songId: string) => void;
}

export default function PlaylistView({
  playlist,
  songs,
  playlistSongs,
  likedSongIds,
  ownerName,
  totalDurationLabel,
  accentColor = "#8B1A1A",
  currentSongId,
  isPlaylistPlaying,
  onPlay,
  onShuffle,
  onPlaySong,
  onLikeSong,
}: PlaylistViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // First 4 covers for mosaic (Song.coverImage is optional → pass as-is)
  const songCovers = songs.slice(0, 4).map(s => s.coverImage);

  // ── GSAP entrance ──────────────────────────────────────────────────────────
  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const hero    = el.querySelector<HTMLElement>("[data-gsap='hero']");
    const actions = el.querySelector<HTMLElement>("[data-gsap='actions']");
    const rows    = el.querySelectorAll<HTMLElement>("[data-gsap='track-row']");

    gsap.set([hero, actions], { opacity: 0, y: 24 });
    gsap.set(rows, { opacity: 0, x: -12 });

    gsap.timeline({ defaults: { ease: "power2.out" } })
      .to(hero,    { opacity: 1, y: 0, duration: 0.45 })
      .to(actions, { opacity: 1, y: 0, duration: 0.3 }, "-=0.2")
      .to(rows,    { opacity: 1, x: 0, duration: 0.25, stagger: 0.03 }, "-=0.1");

  }, { scope: containerRef, dependencies: [playlist.id] });

  return (
    <div
      ref={containerRef}
      className="min-h-full"
      style={{
        background: `linear-gradient(180deg, ${accentColor}22 0%, transparent 400px)`,
      }}
    >
      <div data-gsap="hero">
        <PlaylistHero
          playlist={playlist}
          ownerName={ownerName}
          songCount={playlist.songs.length}
          totalDurationLabel={totalDurationLabel}
          songCovers={songCovers.filter((c): c is string => Boolean(c))}
          accentColor={accentColor}
        />
      </div>

      <div data-gsap="actions">
        <PlaylistActions
          isPlaying={isPlaylistPlaying}
          onPlay={onPlay}
          onShuffle={onShuffle}
        />
      </div>

      <div className="pb-8">
        <PlaylistTrackList
          songs={songs}
          playlistSongs={playlistSongs}
          likedSongIds={likedSongIds}
          currentSongId={currentSongId}
          onPlaySong={onPlaySong}
          onLikeSong={onLikeSong}
        />
      </div>
    </div>
  );
}