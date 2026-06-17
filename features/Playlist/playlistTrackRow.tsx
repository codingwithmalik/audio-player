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

import { useState } from "react";
import { Music2, Play, Heart, MoreHorizontal } from "lucide-react";
import { Song } from "@/types/song";
import Image from "next/image";

interface PlaylistTrackRowProps {
  song: Song;
  index: number; // 1-based
  addedAt: string; // ISO — from playlist join data
  isPlaying: boolean;
  isLiked: boolean;
  onPlay: () => void;
  onLike: () => void;
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

/** Animated equalizer — 3 green bars */
function EqBars() {
  return (
    <div className="flex items-end gap-0.5 h-4" aria-label="Now playing">
      {[
        "animate-[eq1_0.9s_ease-in-out_infinite_alternate]",
        "animate-[eq2_0.9s_ease-in-out_infinite_alternate]",
        "animate-[eq3_0.9s_ease-in-out_infinite_alternate]",
      ].map((cls, i) => (
        <span
          key={i}
          className={`w-0.75 h-full bg-[#1DB954] rounded-sm origin-bottom ${cls}`}
        />
      ))}
      <style>{`
        @keyframes eq1{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
        @keyframes eq2{from{transform:scaleY(.7)}to{transform:scaleY(.2)}}
        @keyframes eq3{from{transform:scaleY(1)}to{transform:scaleY(.4)}}
      `}</style>
    </div>
  );
}

export default function PlaylistTrackRow({
  song,
  index,
  addedAt,
  isPlaying,
  isLiked,
  onPlay,
  onLike,
}: PlaylistTrackRowProps) {
  const [hovered, setHovered] = useState(false);

  const artistLabel = song.artists.join(", ");

  return (
    <div
      role="row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={onPlay}
      className={`
        grid items-center gap-4 px-4 py-2 rounded-md cursor-default select-none
        transition-colors duration-100
        ${hovered ? "bg-white/10" : "bg-transparent"}
      `}
      style={{
        gridTemplateColumns: "32px 1fr 1fr minmax(100px,160px) 48px 32px",
      }}
    >
      {/* ── 1: index / play / equalizer ── */}
      <div className="flex items-center justify-center">
        {isPlaying && !hovered ? (
          <EqBars />
        ) : hovered ? (
          <button onClick={onPlay} aria-label={isPlaying ? "Pause" : "Play"}>
            <Play className="w-4 h-4 fill-white text-white hover:scale-110 transition-transform" />
          </button>
        ) : (
          <span
            className={`text-sm ${isPlaying ? "text-[#1DB954]" : "text-white/50"}`}
          >
            {index}
          </span>
        )}
      </div>

      {/* ── 2: cover + title + artists + like ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Cover */}
        {song.coverImage ? (
          <Image
            src={song.coverImage}
            alt={song.title}
            width={40}
            height={40}
            className="w-10 h-10 rounded object-cover shrink-0"
            draggable={false}
          />
        ) : (
          <div className="">
            <Music2 className="w-4 h-4" />
          </div>
        )}

        {/* Text */}
        <div className="flex flex-col min-w-0">
          <span
            className={`text-sm font-medium truncate ${isPlaying ? "text-[#1DB954]" : "text-white"}`}
          >
            {song.title}
          </span>
          <span className="text-xs text-white/50 truncate hover:text-white cursor-pointer transition-colors">
            {artistLabel}
          </span>
        </div>

        {/* Like */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLike();
          }}
          aria-label={isLiked ? "Remove from liked" : "Save to liked"}
          className={`ml-2 shrink-0 transition-opacity duration-150 ${hovered || isLiked ? "opacity-100" : "opacity-0"}`}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isLiked ? "text-[#1DB954] fill-[#1DB954]" : "text-white/60 hover:text-white"}`}
          />
        </button>
      </div>


      {/* ── 4: date added ── */}
      <span className="text-sm text-white/50 truncate">
        {formatDate(addedAt)}
      </span>

      {/* ── 5: duration ── */}
      <span className="text-sm text-white/50 text-right tabular-nums">
        {formatDuration(song.duration)}
      </span>

      {/* ── 6: more (hover only) ── */}
      <button
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
        className={`text-white/50 hover:text-white transition-all duration-100 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
