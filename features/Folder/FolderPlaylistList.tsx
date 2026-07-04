"use client";

import { FolderOpen } from "lucide-react";
import FolderPlaylistRow from "./FolderPlaylistRow";
import type { Playlist } from "@/types/playlist";

export default function FolderPlaylistList({
  playlists,
}: {
  playlists: Playlist[];
}) {
  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 py-20 text-zinc-500">
        <FolderOpen className="w-12 h-12 opacity-20" />
        <p className="text-sm">No playlists in this folder yet</p>
        <p className="text-xs text-zinc-600">
          Add a playlist using the button above
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2 sm:px-6">
      {playlists.map((playlist) => (
        <div key={playlist.id} data-gsap="playlist-row">
          <FolderPlaylistRow playlist={playlist} />
        </div>
      ))}
    </div>
  );
}
