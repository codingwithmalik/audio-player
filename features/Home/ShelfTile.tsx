"use client";

import { Play } from "lucide-react";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";
import AddToPlaylistMenu from "@/features/Common/AddSongToPlaylists"; // adjust to actual path
import SongCover from "@/features/Common/SongCover";
import type { ShelfItem } from "./ShelfRow";

export default function ShelfTile({ item }: { item: ShelfItem }) {
  const onPlay =
    item.kind === "playlist" ? (item.onPlay ?? item.onClick) : item.onClick;

  return (
    <button
      onClick={item.onClick}
      className="w-full text-left group hover:bg-white/10 p-2 rounded-md"
    >
      <div className="relative w-full aspect-square mb-2">
        {item.kind === "playlist" ? (
          <PlaylistMosaicCover
            coverImage={item.coverImage}
            songCovers={item.songCovers}
            title={item.title}
            isLikedPlaylist={item.isLikedPlaylist}
          />
        ) : (
          <SongCover
            src={item.coverImage}
            alt={item.title}
            fill
            sizes="200px"
          />
        )}
        <span
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-purple-600 shadow-lg flex items-center justify-center
                     opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
        >
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        </span>
        {item.kind === "song" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <AddToPlaylistMenu songId={item.id} />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-white truncate group-hover:underline">
        {item.title}
      </p>
      {item.kind === "song" && item.subtitle && (
        <p className="text-xs text-zinc-400 truncate">{item.subtitle}</p>
      )}
    </button>
  );
}
