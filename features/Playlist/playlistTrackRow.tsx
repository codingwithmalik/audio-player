"use client";

/**
 * PlaylistTrackRow
 * ----------------
 * Single row. Uses Song type directly:
 *   - song.artists[]  → joined as "Artist1, Artist2"
 *   - song.duration   → seconds, formatted as M:SS
 *   - song.coverImage → optional, falls back to a dark placeholder
 *
 * addedAt comes separately (it lives on the playlist join record, not on Song).
 */

import { useRef, useState } from "react";
import { Play, Pause, MoreHorizontal } from "lucide-react";
import { Song } from "@/types/song";
import EqBars from "../Common/EQBars";
import SongMoreOptions from "./songMoreOptions";
import { useParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheet from "../Common/BottomSheet";
import AddToPlaylistMenu from "../Common/AddSongToPlaylists";
import SongCover from "../Common/SongCover";

interface PlaylistTrackRowProps {
  song: Song;
  index: number; // 1-based
  addedAt: string; // ISO — from playlist join data
  isPlaying: boolean;
  onPlay: () => void;
    isCurrent:boolean;
}

/** seconds → M:SS */
function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** ISO → "Sep 24, 2025" */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PlaylistTrackRow({
  song,
  index,
  addedAt,
  isPlaying,
  onPlay,
  isCurrent
}: PlaylistTrackRowProps) {
  const [hovered, setHovered] = useState(false);
  const [SongMoreOptionsOpen, setSongMoreOptionsOpen] = useState(false);
  const params = useParams();
  const IsMobile = useIsMobile();
  const playlistId: string = params.ID as string;
  const anchorRef = useRef<HTMLButtonElement>(null);
  const artistLabel = song.artists.join(", ");

  return (
    <div
      role="row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (window.innerWidth < 640) onPlay();
      }}
      onDoubleClick={() => {
        if (window.innerWidth >= 640) onPlay();
      }}
      className={`
        grid items-center gap-4 px-4 py-2 rounded-md cursor-default select-none
        transition-colors duration-100 sm:grid-cols-[32px_1.5fr_20px_1fr_48px_32px] grid-cols-[1.5fr_20px_32px]
        ${hovered ? "md:bg-white/10" : "bg-transparent"}
      `}
    >
      {/* ── 1: index / play / equalizer ── */}
      <div className="hidden sm:flex items-center justify-center">
        {isPlaying && !hovered ? (
          <EqBars />
        ) : hovered ? (
          <button onClick={onPlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white hover:scale-110 transition-transform" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white hover:scale-110 transition-transform" />
            )}
          </button>
        ) : (
          <span
            className={`text-sm ${isCurrent ? "text-purple-600" : "text-white/50"}`}
          >
            {index}
          </span>
        )}
      </div>

      {/* ── 2: cover + title + artists + like ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Cover */}
        <SongCover src={song.coverImage} alt={song.title} />
        {/* Text */}
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-medium truncate ${isCurrent ? "text-purple-600" : "text-white"}`}
          >
            {song.title}
          </span>
          <span className="text-xs text-white/50 truncate hover:text-white cursor-pointer transition-colors">
            {artistLabel}
          </span>
        </div>
      </div>
      <div className="">
        {/* Add */}
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          className={`text-white/50  hover:text-white transition-all duration-100 max-md:opacity-100 ${hovered ? "md:opacity-100" : "opacity-0"}`}
        >
          <AddToPlaylistMenu
            songId={song.id}
            setHoveredFalse={() => setHovered(false)}
          />
        </div>
      </div>
      {/* ── 4: date added ── */}
      <span className="hidden sm:block text-sm text-white/50 truncate">
        {formatDate(addedAt)}
      </span>

      {/* ── 5: duration ── */}
      <span className="hidden sm:block text-sm text-white/50 text-right tabular-nums">
        {formatDuration(song.duration)}
      </span>

      {/* ── 6: more (hover only) ── */}
      <div className="relative z-9999">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSongMoreOptionsOpen((v) => !v);
          }}
          ref={anchorRef}
          aria-label="More options"
          className={`text-white/50 hover:text-white transition-all duration-100 max-md:opacity-100 ${hovered ? "md:opacity-100" : "opacity-0"}`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {IsMobile ? (
          <BottomSheet
            isOpen={SongMoreOptionsOpen}
            onClose={() => setSongMoreOptionsOpen(false)}
          >
            <SongMoreOptions
              songId={song.id}
              playlistId={playlistId}
              onClose={() => setSongMoreOptionsOpen(false)}
              variant="sheet"
              anchorRef={anchorRef}
            />
          </BottomSheet>
        ) : (
          SongMoreOptionsOpen && (
            // <div
            //   className="absolute right-0 bottom-full mt-2 w-65
            //        bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl py-2"
            // >
            <SongMoreOptions
              anchorRef={anchorRef}
              songId={song.id}
              playlistId={playlistId}
              onClose={() => setSongMoreOptionsOpen(false)}
              variant="dropdown"
            />
            // </div>
          )
        )}
      </div>
    </div>
  );
}
