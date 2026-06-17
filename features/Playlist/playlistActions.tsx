"use client";

/**
 * PlaylistActions
 * ---------------
 * Play, Shuffle, Download, Follow, Mix, More, List-toggle.
 * All dispatch callbacks come in as props from the page.
 */

import {
  Play,
  Pause,
  Shuffle,
  Download,
  MoreHorizontal,
  List,
} from "lucide-react";

interface PlaylistActionsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onShuffle: () => void;
}

export default function PlaylistActions({
  isPlaying,
  onPlay,
  onShuffle,
}: PlaylistActionsProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {/* Left cluster */}
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <button
          onClick={onPlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center
                     shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150
                     hover:bg-white shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-black fill-black" />
          ) : (
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          )}
        </button>

        {/* Shuffle */}
        <button
          onClick={onShuffle}
          aria-label="Shuffle"
          className="text-white/60 hover:text-white hover:scale-105 active:scale-95
                     transition-all duration-150"
        >
          <Shuffle className="w-6 h-6" />
        </button>

        {/* Download */}
        <button
          aria-label="Download"
          className="text-white/60 hover:text-white transition-colors duration-150"
        >
          <Download className="w-6 h-6" />
        </button>

        {/* More */}
        <button
          aria-label="More options"
          className="text-white/60 hover:text-white transition-colors duration-150"
        >
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Right — list toggle */}
      <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-150">
        List <List className="w-5 h-5" />
      </button>
    </div>
  );
}
