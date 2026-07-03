"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/globalHooks";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";
import { selectSongById } from "@/features/Songs/songsSlice";
import type { Playlist } from "@/types/playlist";
import type { RootState } from "@/store/store";

export default function FolderPlaylistRow({ playlist }: { playlist: Playlist }) {
  const router = useRouter();

  // Resolve first 4 song covers for mosaic
  const songCovers = useAppSelector((state: RootState) =>
    playlist.songs
      .slice(0, 4)
      .map((s) => selectSongById(state, s.songId)?.coverImage)
  );

  return (
    <button
      onClick={() => router.push(`/playlist/${playlist.id}`)}
      className="group w-full flex items-center gap-4 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors duration-150"
    >
      <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden">
        <PlaylistMosaicCover
          coverImage={playlist.coverImage}
          songCovers={songCovers}
          title={playlist.title}
        />
      </div>

      <div className="flex flex-col items-start min-w-0">
        <p className="text-sm font-semibold text-white truncate group-hover:text-white/80 transition-colors">
          {playlist.title}
        </p>
        <p className="text-xs text-zinc-500">
          {playlist.songs.length}{" "}
          {playlist.songs.length === 1 ? "song" : "songs"}
        </p>
      </div>
    </button>
  );
}