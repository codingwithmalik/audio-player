"use client";

/**
 * PlaylistHero
 * ------------
 * Gradient header with cover art, title, owner, and stats.
 * Receives resolved data from the page — no Redux calls here.
 */

import PlaylistMosaicCover from "./playlistMosaicCover";
import { Playlist } from "@/types/playlist";

interface PlaylistHeroProps {
  playlist: Playlist;
  ownerName: string; // resolved from User by ownerId in the page
  songCount: number;
  totalDurationLabel: string; // e.g. "about 1 hr 30 min"
  songCovers: (string | undefined)[]; // Song.coverImage[] for mosaic
  accentColor?: string; // dominant color extracted from cover
}

export default function PlaylistHero({
  playlist,
  ownerName,
  songCount,
  totalDurationLabel,
  songCovers,
  accentColor = "#8B1A1A",
}: PlaylistHeroProps) {
  return (
    <div
      className="relative w-full"
      style={{
        background: `linear-gradient(180deg, ${accentColor}CC 0%, ${accentColor}44 60%, transparent 100%)`,
      }}
    >
      <div className="flex items-end gap-6 px-6 pt-10 pb-6">
        {/* Cover art — mosaic or single */}
        <PlaylistMosaicCover
          coverImage={playlist.coverImage}
          songCovers={songCovers.filter((c): c is string => Boolean(c))}
          title={playlist.title}
          size={224}
        />

        {/* Text metadata */}
        <div className="flex flex-col gap-2 min-w-0 pb-2">
          {/* <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Public Playlist
          </span> */}
          {/* commented because I don't want that for now  */}
          <h1
            className="font-black text-white leading-none select-none"
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              wordBreak: "break-word",
            }}
          >
            {playlist.title}
          </h1>

          {playlist.description && (
            <p className="text-sm text-white/60 mt-1 line-clamp-2">
              {playlist.description}
            </p>
          )}

          {/* Owner + stats */}
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {/* Avatar initial */}
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-1 shrink-0">
              <span className="text-[10px] font-bold text-white">
                {ownerName.charAt(0).toUpperCase()}
              </span>
            </div>

            <span className="text-sm font-semibold text-white hover:underline cursor-pointer">
              {ownerName}
            </span>

            <span className="text-sm text-white/60 mx-1">•</span>
            <span className="text-sm text-white/60 font-medium ">
              {songCount} songs,{" "}
              <span className="text-white/60">{totalDurationLabel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
