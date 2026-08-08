"use client";

import { FolderOpen } from "lucide-react";
import FolderPlaylistRow from "./FolderPlaylistRow";
import type { Playlist } from "@/types/playlist";
import FolderPlaylistRowSkeleton from "./Animations/FolderPlaylistRowSkeleton";
import ErrorState from "../Common/Animations/ErrorState";

export default function FolderPlaylistList({
  playlists,
    isLoading,
  isError,
  onRetry,
}: {
  playlists: Playlist[];
    isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}) {

    if (isError) {
    return (
      <div className="px-2 sm:px-6">
        <ErrorState message="Couldn't load playlists in this folder." onRetry={onRetry} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col px-2 sm:px-6 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <FolderPlaylistRowSkeleton key={i} />
        ))}
      </div>
    );
  }
  
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
