// app/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylists,
  selectPlaylistCount,
  selectPlaylistSongCovers,
} from "@/features/Playlist/playlistSlice";
import ProfileHeaderCard from "@/features/Profile/ProfileHeaderCard";
import ShelfTile from "@/features/Home/ShelfTile"; // adjust to actual path
import type { ShelfPlaylistItem } from "@/features/Home/ShelfRow"; // adjust to actual path
import { Playlist } from "@/types/playlist";
import {
  setCurrentIndex,
  setQueue,
} from "@/features/RightSidebar/Queue/queueSlice";
import { setSong } from "@/slices/playerSlice";

export default function ProfilePage() {
  const playlists = useAppSelector(selectPlaylists);
  const playlistCount = useAppSelector(selectPlaylistCount);
  // Actually plays the playlist (queue + first song), distinct from navigating to it.

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="h-full"
      defer
    >
      <div className="p-6 flex flex-col gap-8">
        <ProfileHeaderCard playlistCount={playlistCount} />

        <section>
          <h2 className="text-xl font-bold mb-4">Playlists</h2>
          {playlists.length === 0 ? (
            <p className="text-white/60 text-sm">
              You haven&apos;t created any playlists yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {playlists.map((playlist) => (
                <PlaylistShelfTile key={playlist.id} playlistId={playlist.id} />
              ))}
            </div>
          )}
        </section>
      </div>
    </OverlayScrollbarsComponent>
  );
}

function PlaylistShelfTile({ playlistId }: { playlistId: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlist = useAppSelector(
    (state) => state.playlists.entities[playlistId],
  );
  const songCovers = useAppSelector((state) =>
    selectPlaylistSongCovers(state, playlist),
  );
  const handlePlaylistPlay = (playlist: Playlist) => {
    const songIds = playlist.songs.map((s) => s.songId);
    if (songIds.length === 0) return;
    dispatch(
      setQueue({ songIds, sourceType: "playlist", sourceId: playlist.id }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(songIds[0]));
  };

  if (!playlist) return null;

  const item: ShelfPlaylistItem = {
    kind: "playlist",
    id: playlist.id,
    title: playlist.title,
    coverImage: playlist.coverImage,
    songCovers,
    isLikedPlaylist: playlist.id.startsWith("liked-"),
    onClick: () => router.push(`/playlist/${playlist.id}`), // adjust to your real route
    onPlay: () => {
      handlePlaylistPlay(playlist);
    },
  };

  return <ShelfTile item={item} />;
}
