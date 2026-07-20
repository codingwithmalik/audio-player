"use client";

import { Play, X } from "lucide-react";
import SongCover from "@/features/Common/SongCover";
import type { Song } from "@/types/song";
import AddSongToPlaylists from "@/features/Common/AddSongToPlaylists";
interface SearchResultRowProps {
  song: Song;
  onClick: () => void;
  /** Only pass this for recent-search rows — omit for typed-result rows. */
  onRemove?: () => void;
}

export default function SearchResultRow({
  song,
  onClick,
  onRemove,
}: SearchResultRowProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 rounded-md p-2 pr-3 text-left hover:bg-white/10 transition-colors"
    >
      <div className="relative w-12 h-12 shrink-0">
        <SongCover src={song.coverImage} alt={song.title} fill sizes="48px" />
        <span className="absolute inset-0 flex items-center justify-center rounded-md bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4 text-purple-600 fill-purple-600" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white truncate">{song.title}</p>
        <p className="text-xs text-zinc-400 truncate">
          Song • {song.artists.join(", ")}
        </p>
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <AddSongToPlaylists songId={song.id} />
      </span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-white"
          aria-label="Remove from recent searches"
        >
          <X className="w-4 h-4" />
        </span>
      )}
    </div>
  );
}
