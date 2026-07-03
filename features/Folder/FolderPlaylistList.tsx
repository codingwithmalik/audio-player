"use client";

import { Music2 } from "lucide-react";
import FolderPlaylistRow from "./FolderPlaylistRow";
import type { Playlist } from "@/types/playlist";

export default function FolderPlaylistList({
  playlists,
}: {
  playlists: Playlist[];
}) {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500">
        <Music2 className="w-10 h-10 opacity-30" />
        <p className="text-sm">No playlists in this folder yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-6 pb-8">
      {playlists.map((playlist) => (
        <div key={playlist.id} data-gsap="playlist-row">
          <FolderPlaylistRow playlist={playlist} />
        </div>
      ))}
    </div>
  );
}