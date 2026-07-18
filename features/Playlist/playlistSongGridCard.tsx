"use client";

import { Song } from "@/types/song";
import { Pause, Play } from "lucide-react";
import SongCover from "../Common/SongCover";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function PlaylistSongGridCard({
  song,
  isPlaying,
  onPlaySong,
  isCurrent,
  isReorderEnabled,
}: {
  song: Song;
  isPlaying: boolean;
  onPlaySong: () => void;
  isCurrent: boolean;
  isReorderEnabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: song.id,
    disabled: !isReorderEnabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isReorderEnabled ? { ...attributes, ...listeners } : {})}
      onClick={() => {
        if (window.innerWidth < 640) onPlaySong();
      }}
      onDoubleClick={() => {
        if (window.innerWidth >= 640) onPlaySong();
      }}
      className={`flex flex-col gap-2 p-3 rounded-xl md:hover:bg-white/10
                 transition-colors duration-150 cursor-default group bg-white/5 touch-none`}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden z-10">
        <div className="relative w-full h-full rounded-md shrink-0 flex items-center justify-center">
          <SongCover src={song.coverImage} alt={song.title} fill={true} />
        </div>
        <div
          className="absolute inset-0 bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100
                    transition-opacity duration-150"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlaySong();
            }}
            aria-label="Play"
            className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          >
            <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="text-black fill-black" />
              ) : (
                <Play className="text-black fill-black " />
              )}
            </div>
          </button>
        </div>
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium truncate ${isCurrent ? "text-purple-600" : "text-white"}`}
        >
          {song.title}
        </p>
        <p className="text-xs text-white/50 truncate">
          {song.artists.join(", ")}
        </p>
      </div>
    </div>
  );
}
