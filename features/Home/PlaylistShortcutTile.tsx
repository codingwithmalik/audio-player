"use client";

import { Play } from "lucide-react";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";

interface PlaylistShortcutTileProps {
  title: string;
  coverImage?: string;
  songCovers: (string | undefined)[];
  isLikedPlaylist?: boolean;
  onClick: () => void;
  onPlay: () => void;
}

export default function PlaylistShortcutTile({
  title,
  coverImage,
  songCovers,
  isLikedPlaylist,
  onClick,
  onPlay,
}: PlaylistShortcutTileProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-2 sm:gap-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-left overflow-hidden w-full min-w-0"
    >
      <div className="relative w-11 h-11 sm:w-14 sm:h-14 shrink-0">
        <PlaylistMosaicCover
          coverImage={coverImage}
          songCovers={songCovers}
          title={title}
          isLikedPlaylist={isLikedPlaylist}
        />
      </div>
      <span className="font-semibold text-sm sm:text-base text-white flex-1 min-w-0 md:truncate md:pr-12">
        {title}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-600 shadow-lg flex items-center justify-center
                 opacity-0 translate-x-1 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-200 max-md:hidden"
      >
        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white ml-0.5" />
      </span>
    </button>
  );
}