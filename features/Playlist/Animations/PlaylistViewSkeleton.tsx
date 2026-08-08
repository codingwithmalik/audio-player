"use client";

import { useAppSelector } from "@/globalHooks";
import { selectViewMode } from "@/features/Playlist/playlistSlice";
import PlaylistHeroSkeleton from "./PlaylistHeroSkeleton";
import PlaylistActionsSkeleton from "./PlaylistActionsSkeleton";
import PlaylistTrackListSkeleton from "./PlaylistTrackListSkeleton";
import PlaylistTrackGridSkeleton from "./PlaylistTrackGridSkeleton";

export default function PlaylistViewSkeleton() {
  const viewMode = useAppSelector(selectViewMode);
  return (
    <div>
      <PlaylistHeroSkeleton />
      <PlaylistActionsSkeleton />
      {viewMode === "list" ? (
        <PlaylistTrackListSkeleton />
      ) : (
        <PlaylistTrackGridSkeleton />
      )}
    </div>
  );
}
