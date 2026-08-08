"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectHomeSections,
  SHELF_LIMITS,
} from "@/features/Home/homeSelectors";
import ShelfRow, { ShelfItem } from "@/features/Home/ShelfRow";
import ShelfTile from "@/features/Home/ShelfTile";
import PlaylistShortcutTile from "@/features/Home/PlaylistShortcutTile";
import { selectPlaylistSongCovers } from "@/features/Playlist/playlistSlice";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { setSong } from "@/slices/playerSlice";
import type { RootState } from "@/store/store";
import type { Playlist } from "@/types/playlist";
import type { Song } from "@/types/song";
import { useGetSongsQuery, useGetSongsByIdsQuery } from "../Songs/songsApi";
import { useGetPlaylistsQuery } from "../Playlist/playlistsApi";
import { useGetRecommendationsQuery } from "@/features/Recommendation/recommendationsApi";
import { useGetHistoryQuery } from "../History/historyApi";
import ErrorState from "@/features/Common/Animations/ErrorState";
import HomeSkeleton from "@/features/Home/Animations/HomeSkeleton";
import GridSkeleton from "@/features/Common/Animations/GridSkeleton";

const PAGE_SIZE = 20;

export default function HomeSections() {
  const { status } = useSession();
  const isGuest = status === "unauthenticated";

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<string>("home");
  const [page, setPage] = useState(1);

  // Reset pagination whenever the active tab changes — switching away and
  // back to a section should start fresh, not resume mid-scroll.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeTab]);

  const playlistsById = useAppSelector((s: RootState) => s.playlists.entities);
  const songsById = useAppSelector((s: RootState) => s.songs.entities);
  const recentSongIds = useAppSelector(
    (s: RootState) => s.history.recentSongIds,
  );
  const sections = useAppSelector(selectHomeSections);

  // ── Base data — playlists and history are small, bounded by this user,
  // and fetched once regardless of tab. ──
  const {
    isLoading: playlistsLoading,
    isError: playlistsError,
    refetch: refetchPlaylists,
  } = useGetPlaylistsQuery();
  useGetHistoryQuery();

  // ── Home shelves — each fetches exactly SHELF_LIMIT + 1. The extra one is
  // never rendered; it's just how "Show all" knows there's more without
  // guessing or pulling in far more data than the shelf needs. ──
  const shelfNewReleasesLimit = SHELF_LIMITS["new-releases"] + 1;
  const {
    isLoading: newReleasesShelfLoading,
    isError: newReleasesShelfError,
    refetch: refetchNewReleasesShelf,
  } = useGetSongsQuery(
    { limit: shelfNewReleasesLimit },
    { skip: activeTab !== "home" },
  );

  const jumpBackInShelfIds = recentSongIds.slice(
    0,
    SHELF_LIMITS["jump-back-in"] + 1,
  );
  const {
    isLoading: jumpBackInShelfLoading,
    isError: jumpBackInShelfError,
    refetch: refetchJumpBackInShelf,
  } = useGetSongsByIdsQuery(jumpBackInShelfIds, {
    skip: activeTab !== "home" || jumpBackInShelfIds.length === 0,
  });

  const {
    data: madeForYouShelfData,
    isLoading: madeForYouShelfLoading,
    isError: madeForYouShelfError,
    refetch: refetchMadeForYouShelf,
  } = useGetRecommendationsQuery(
    { type: "madeForYou", limit: SHELF_LIMITS["made-for-you"] + 1 },
    { skip: activeTab !== "home" },
  );

  // ── Full view — paginated, only fetched when its tab is actually active.
  // Growing-limit pattern (skip always 0): each "Load more" click just asks
  // for a bigger prefix, keeping the cache simple and always contiguous. ──
  const {
    data: newReleasesFullData,
    isFetching: newReleasesFullFetching,
    isLoading: newReleasesFullLoading,
    isError: newReleasesFullError,
    refetch: refetchNewReleasesFull,
  } = useGetSongsQuery(
    { limit: page * PAGE_SIZE },
    { skip: activeTab !== "new-releases" },
  );
  const newReleasesHasMore =
    (newReleasesFullData?.length ?? 0) === page * PAGE_SIZE;

  const {
    data: madeForYouFullData,
    isFetching: madeForYouFullFetching,
    isLoading: madeForYouFullLoading,
    isError: madeForYouFullError,
    refetch: refetchMadeForYouFull,
  } = useGetRecommendationsQuery(
    { type: "madeForYou", limit: page * PAGE_SIZE },
    { skip: activeTab !== "made-for-you" },
  );
  const madeForYouHasMore =
    (madeForYouFullData?.songs?.length ?? 0) === page * PAGE_SIZE;

  // Jump Back In needs no backend pagination — history is already fully
  // loaded — this just reveals more of the already-known id list and fetches
  // the song objects for that growing slice.
  const jumpBackInFullIds = recentSongIds.slice(0, page * PAGE_SIZE);
  const {
    data: jumpBackInFullSongs,
    isFetching: jumpBackInFullFetching,
    isLoading: jumpBackInFullLoading,
    isError: jumpBackInFullError,
    refetch: refetchJumpBackInFull,
  } = useGetSongsByIdsQuery(jumpBackInFullIds, {
    skip: activeTab !== "jump-back-in" || jumpBackInFullIds.length === 0,
  });
  const jumpBackInHasMore = recentSongIds.length > jumpBackInFullIds.length;

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

  const handlePlaylistPlay = (playlist: Playlist) => {
    const songIds = playlist.songs.map((s) => s.songId);
    if (songIds.length === 0) return;
    dispatch(
      setQueue({ songIds, sourceType: "playlist", sourceId: playlist.id }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(songIds[0]));
  };

  const buildSongItem = (song: Song, allIds: string[]): ShelfItem => ({
    kind: "song",
    id: song.id,
    title: song.title,
    subtitle: song.artists[0],
    coverImage: song.coverImage,
    onClick: () => handleSongClick(allIds, song.id),
  });

  const buildItems = (section: (typeof sections)[number]): ShelfItem[] => {
    if (section.id === "made-for-you") {
      const songs = madeForYouShelfData?.songs ?? [];
      const allIds = songs.map((s) => s.id);
      return songs.map((song) => buildSongItem(song, allIds));
    }
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
      .map((song) => buildSongItem(song, section.itemIds));
  };

  // Guests see trending songs under this section server-side — the heading
  // should say so instead of implying personalization that isn't happening.
  const displaySections = sections.map((s) =>
    s.id === "made-for-you"
      ? { ...s, title: isGuest ? "Trending Now" : "Made For You" }
      : s,
  );

  const activeSection = displaySections.find((s) => s.id === activeTab);

  // ── Full-section view ──
  if (activeTab !== "home" && activeSection) {
    const isPaginatedSongSection =
      activeTab === "new-releases" ||
      activeTab === "made-for-you" ||
      activeTab === "jump-back-in";

    const backButton = (
      <button
        onClick={() => setActiveTab("home")}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>
    );

    const heading = (
      <h2 className="text-2xl font-bold text-white mb-6">
        {activeSection.title}
      </h2>
    );

    if (isPaginatedSongSection) {
      let fullSongs: Song[] = [];
      let fullLoading = false;
      let fullFetching = false;
      let fullError = false;
      let hasMore = false;
      let onRetry = () => {};

      if (activeTab === "new-releases") {
        fullSongs = newReleasesFullData ?? [];
        fullLoading = newReleasesFullLoading;
        fullFetching = newReleasesFullFetching;
        fullError = newReleasesFullError;
        hasMore = newReleasesHasMore;
        onRetry = refetchNewReleasesFull;
      } else if (activeTab === "made-for-you") {
        fullSongs = madeForYouFullData?.songs ?? [];
        fullLoading = madeForYouFullLoading;
        fullFetching = madeForYouFullFetching;
        fullError = madeForYouFullError;
        hasMore = madeForYouHasMore;
        onRetry = refetchMadeForYouFull;
      } else {
        fullSongs = jumpBackInFullSongs ?? [];
        fullLoading = jumpBackInFullLoading;
        fullFetching = jumpBackInFullFetching;
        fullError = jumpBackInFullError;
        hasMore = jumpBackInHasMore;
        onRetry = refetchJumpBackInFull;
      }

      const allIdsForQueue = fullSongs.map((s) => s.id);

      return (
        <div className="px-6 py-4">
          {backButton}
          {heading}

          {fullError ? (
            <ErrorState
              message="Couldn't load these songs."
              onRetry={onRetry}
            />
          ) : fullLoading ? (
            <GridSkeleton count={PAGE_SIZE} />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {fullSongs.map((song) => (
                  <ShelfTile
                    key={song.id}
                    item={buildSongItem(song, allIdsForQueue)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={fullFetching}
                    className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    {fullFetching && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {fullFetching ? "Loading..." : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    // ── Playlist full views — uncapped, no pagination, no dedicated fetch
    // (playlists are already loaded app-wide). ──
    const items = buildItems(activeSection);
    return (
      <div className="px-6 py-4">
        {backButton}
        {heading}
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
      </div>
    );
  }

  // ── Home view ──
  if (
    (!isGuest && playlistsError && jumpBackInShelfError) ||
    newReleasesShelfError ||
    madeForYouShelfError
  ) {
    return (
      <div className="px-6 py-4">
        <ErrorState
          message="Couldn't load your home page. Please try again."
          onRetry={() => {
            if (!isGuest) {
              refetchPlaylists();
              refetchJumpBackInShelf();
            }
            refetchNewReleasesShelf();
            refetchMadeForYouShelf();
          }}
        />
      </div>
    );
  }

  if (
    playlistsLoading ||
    newReleasesShelfLoading ||
    jumpBackInShelfLoading ||
    madeForYouShelfLoading
  ) {
    return <HomeSkeleton />;
  }

  return (
    <div className="px-6 py-4">
      {displaySections.map((section) => {
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
