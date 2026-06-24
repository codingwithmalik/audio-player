"use client";

/**
 * PlaylistHero
 * ------------
 * Gradient header with cover art, title, owner, and stats.
 * Receives resolved data from the page — no Redux calls here.
 */

import PlaylistMosaicCover from "./playlistMosaicCover";
import { Playlist } from "@/types/playlist";
import { selectUsernameById } from "@/features/Auth/authSlice";
import { useAppSelector } from "@/globalHooks";

interface PlaylistHeroProps {
  playlist: Playlist;
  songCount: number;
  totalDurationLabel: string; // e.g. "about 1 hr 30 min"
  songCovers: (string | undefined)[]; // Song.coverImage[] for mosaic
  accentColor?: string; // dominant color extracted from cover
  onEditDetails: () => void;
  onEditCover: () => void;
}

export default function PlaylistHero({
  playlist,
  songCount,
  totalDurationLabel,
  songCovers,
  accentColor = "#8B1A1A",
  onEditDetails,
  onEditCover,
}: PlaylistHeroProps) {
  const ownerId = playlist?.ownerId;
  const ownerName = useAppSelector((s) => selectUsernameById(s, ownerId ?? ""));
  
  return (
    <div
      className="relative w-full"
      style={{
        background: `linear-gradient(180deg, ${accentColor}CC 0%, ${accentColor}44 60%, transparent 100%)`,
      }}
    >
      <div className="flex items-end gap-6 p-6" >
        {/* Cover art — mosaic or single */}
        <div className="relative rounded-lg overflow-hidden shrink-0 shadow-xl group
                       cursor-pointer bg-white/10"
                       onClick={onEditCover}
                       >
          <PlaylistMosaicCover
            coverImage={playlist.coverImage}
            songCovers={songCovers.filter((c): c is string => Boolean(c))}
            title={playlist.title}
            size={224}
          />
          <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2
                         bg-black/60 opacity-0 group-hover:opacity-100
                         transition-opacity duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span className="text-white text-xs font-semibold">
                Choose photo
              </span>
            </div>
        </div>

        {/* Text metadata */}
        <div className="flex flex-col gap-2 min-w-0 pb-2">
          {/* commented because I don't want that for now  */}
          <h1
            className="font-black text-white leading-none select-none hover:cursor-pointer "
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              wordBreak: "break-word",
            }}
            onClick={onEditDetails}
          >
            {playlist.title}
          </h1>

          {playlist.description && (
            <p
              className="text-sm text-white/60 mt-1 line-clamp-2 hover:cursor-pointer"
              onClick={onEditDetails}
            >
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
