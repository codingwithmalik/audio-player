"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectHomeSections,
  SHELF_LIMITS,
} from "@/features/Home/homeSelectors";
import ShelfRow, { ShelfItem } from "@/features/Home/ShelfRow";
import ShelfTile from "@/features/Home/ShelfTile";
import PlaylistShortcutTile from "@/features/Home/PlaylistShortcutTile";
import { selectPlaylistSongCovers } from "@/features/Playlist/playlistSlice";
import { store } from "@/store/store";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { setSong } from "@/store/playerSlice";
import type { RootState } from "@/store/store";
import type { Playlist } from "@/types/playlist";
import type { Song } from "@/types/song";

export default function HomeSections() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state: RootState) => state.auth.user?.id);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [sections, setSections] = useState<
    ReturnType<typeof selectHomeSections>
  >([]);
  const playlistsById = useAppSelector((s: RootState) => s.playlists.entities);
  const songsById = useAppSelector((s: RootState) => s.songs.entities);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSections(selectHomeSections(store.getState()));
  }, [currentUser]);

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/playlist/${playlistId}`);
  };

  const handleSongClick = (allSongIds: string[], clickedSongId: string) => {
    const reordered = [
      clickedSongId,
      ...allSongIds.filter((id) => id !== clickedSongId),
    ];
    dispatch(
      setQueue({ songIds: reordered, sourceType: "home", sourceId: null }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(clickedSongId));
  };

  // Actually plays the playlist (queue + first song), distinct from navigating to it.
  const handlePlaylistPlay = (playlist: Playlist) => {
    const songIds = playlist.songs.map((s) => s.songId);
    if (songIds.length === 0) return;
    dispatch(
      setQueue({ songIds, sourceType: "playlist", sourceId: playlist.id }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(songIds[0]));
  };

  const buildItems = (section: (typeof sections)[number]): ShelfItem[] => {
    if (section.itemType === "playlist") {
      return section.itemIds
        .map((id) => playlistsById[id])
        .filter((p): p is Playlist => !!p)
        .map((playlist) => {
          const songCovers = selectPlaylistSongCovers(
            {
              playlists: { entities: playlistsById },
              songs: { entities: songsById },
            } as RootState,
            playlist,
          );
          return {
            kind: "playlist" as const,
            id: playlist.id,
            title: playlist.title,
            coverImage: playlist.coverImage,
            songCovers,
            isLikedPlaylist: playlist.id.startsWith("liked-"),
            onClick: () => handlePlaylistClick(playlist.id),
            onPlay: () => handlePlaylistPlay(playlist),
          };
        });
    }
    return section.itemIds
      .map((id) => songsById[id])
      .filter((s): s is Song => !!s)
      .map((song) => ({
        kind: "song" as const,
        id: song.id,
        title: song.title,
        subtitle: song.artists[0],
        coverImage: song.coverImage,
        onClick: () => handleSongClick(section.itemIds, song.id),
      }));
  };

  const activeSection = sections.find((s) => s.id === activeTab);

  // ── Full-section view ──
  if (activeTab !== "home" && activeSection) {
    const items = buildItems(activeSection);
    const isPlaylistSection = activeSection.itemType === "playlist";

    return (
      <div className="px-6 py-4">
        <button
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">
          {activeSection.title}
        </h2>

        {isPlaylistSection ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) =>
              item.kind === "playlist" ? (
                <PlaylistShortcutTile
                  key={item.id}
                  title={item.title}
                  coverImage={item.coverImage}
                  songCovers={item.songCovers}
                  isLikedPlaylist={item.isLikedPlaylist}
                  onClick={item.onClick}
                  onPlay={item.onPlay ?? item.onClick}
                />
              ) : null,
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <ShelfTile key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Home view ──
  return (
    <div className="px-6 py-4">
      {sections.map((section) => {
        const fullItems = buildItems(section);
        const shelfLimit = SHELF_LIMITS[section.id] ?? fullItems.length;
        const shelfItems = fullItems.slice(0, shelfLimit);

        if (section.id === "your-playlists") {
          return (
            <section key={section.id} className="mb-8">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {shelfItems.map((item) =>
                  item.kind === "playlist" ? (
                    <PlaylistShortcutTile
                      key={item.id}
                      title={item.title}
                      coverImage={item.coverImage}
                      songCovers={item.songCovers}
                      isLikedPlaylist={item.isLikedPlaylist}
                      onClick={item.onClick}
                      onPlay={item.onPlay ?? item.onClick}
                    />
                  ) : null,
                )}
              </div>
            </section>
          );
        }

        return (
          <ShelfRow
            key={section.id}
            title={section.title}
            items={shelfItems}
            hasMore={fullItems.length > shelfLimit}
            onShowAll={() => setActiveTab(section.id)}
          />
        );
      })}
    </div>
  );
}
