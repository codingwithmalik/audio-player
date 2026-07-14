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
      className="group relative flex items-center gap-3 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-left overflow-hidden"
    >
      <div className="relative w-14 h-14 shrink-0">
        <PlaylistMosaicCover
          coverImage={coverImage}
          songCovers={songCovers}
          title={title}
          isLikedPlaylist={isLikedPlaylist}
        />
      </div>
      <span className="font-semibold text-white truncate flex-1 pr-2">
        {title}
      </span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-600 shadow-lg flex items-center justify-center
                 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      >
        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
      </span>
    </button>
  );
}
