"use client";

import Image from "next/image";
import { useState } from "react";
import { Music2 } from "lucide-react";
import { useAppSelector } from "@/globalHooks";
import { selectCurrentSong, selectIsPlaying } from "@/store/playerSlice";
import { Song } from "@/types/song";
import EqBars from "../Common/EQBars";

// ─── Cover Art ────────────────────────────────────────────────────────────────

const CoverArt = ({
  song,
  isPlaying,
  size,
}: {
  song: Song;
  isPlaying: boolean;
  size: "sm" | "md";
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = !!song.coverImage && !imgError;

  const dim =
    size === "sm"
      ? "h-10 w-10 rounded-lg"
      : "h-11 w-11 rounded-xl lg:h-12 lg:w-12";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4 lg:h-5 lg:w-5";

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-white/10 bg-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${dim}`}
    >
      {/* Icon as base layer — always visible until image loads */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${showImage ? "opacity-0" : "opacity-100"}`}
      >
        <Music2 className={`text-white/30 ${iconSize}`} />
      </div>

      {showImage && (
        <Image
          src={song.coverImage!}
          alt={song.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* EQ bars overlay while playing */}
      {isPlaying &&(
        <div className="absolute inset-0 flex items-end justify-center gap-0.5 bg-black/70 ">
          <EqBars/>
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SongInfo() {
  const song = useAppSelector(selectCurrentSong);
  const isPlaying = useAppSelector(selectIsPlaying);

  if (!song) return null;

  return (
    <>
      {/* ── MOBILE ── */}
      <div className="flex items-center gap-2.5 md:hidden">
        <CoverArt song={song} isPlaying={isPlaying} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {song.title}
          </p>
          <p className="truncate text-[11px] text-neutral-500">
            {song.artists.join(", ")}
          </p>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div
        className="hidden min-w-0 items-center gap-2.5 md:flex lg:gap-3"
        style={{ width: "clamp(200px, 22%, 280px)", flexShrink: 0 }}
      >
        <CoverArt song={song} isPlaying={isPlaying} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {song.title}
          </p>
          <p className="truncate text-xs text-neutral-500">
            {song.artists.join(", ")}
          </p>
        </div>
      </div>
    </>
  );
}
