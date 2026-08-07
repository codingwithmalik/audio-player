"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Music2, Play, Plus } from "lucide-react";
import {
  useGetSongsQuery,
  useDeleteSongMutation,
} from "@/features/Songs/songsApi";
import { useGetRecommendationsQuery } from "@/features/Recommendation/recommendationsApi";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import AdminSidebar, { type AdminTab } from "@/features/Admin/adminSidebar";
import AdminTopBar from "@/features/Admin/AdminTopBar";
import SongUpload from "@/features/Admin/SongUpload";
import SongRowSkeleton from "@/features/Common/Animations/SongRowSkeleton";
import SongCover from "@/features/Common/SongCover";
import type { Song } from "@/types/song";
import { useSearchQuery } from "@/features/Search/searchApi";
import "overlayscrollbars/overlayscrollbars.css";

export default function AdminSongsPage() {
  const [tab, setTab] = useState<AdminTab>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    song?: Song;
  }>({
    open: false,
    mode: "create",
  });

  const {
    data: allSongs = [],
    isLoading: allLoading,
    isError: allError,
  } = useGetSongsQuery({ limit: 100 }, { skip: tab !== "all" });
  const {
    data: popularData,
    isLoading: popularLoading,
    isError: popularError,
  } = useGetRecommendationsQuery(
    { type: "popular", limit: 50 },
    { skip: tab !== "popular" },
  );
  const {
    data: trendingData,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useGetRecommendationsQuery(
    { type: "trending", limit: 50 },
    { skip: tab !== "trending" },
  );

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const isSearching = debouncedQuery.trim().length > 0;
  const {
    data: searchResult,
    isLoading: searchLoading,
    isError: searchError,
  } = useSearchQuery({ q: debouncedQuery, skip: 0 }, { skip: !isSearching });

  const [deleteSong] = useDeleteSongMutation();

  const songs: Song[] = useMemo(() => {
    switch (tab) {
      case "all":
        return allSongs;
      case "popular":
        return popularData?.songs || [];
      case "trending":
        return trendingData?.songs || [];
      default:
        return [];
    }
  }, [tab, allSongs, popularData, trendingData]);

  const isLoading = (() => {
    switch (tab) {
      case "all":
        return allLoading;
      case "popular":
        return popularLoading;
      default:
        return trendingLoading;
    }
  })();
  const isError = (() => {
    switch (tab) {
      case "all":
        return allError;
      case "popular":
        return popularError;
      default:
        return trendingError;
    }
  })();

  const displayedSongs: Song[] = isSearching
    ? (searchResult?.songs ?? [])
    : songs;
  const displayedLoading = isSearching ? searchLoading : isLoading;
  const displayedError = isSearching ? searchError : isError;

  function openCreate() {
    setFormState({ open: true, mode: "create" });
  }
  function openEdit(song: Song) {
    setFormState({ open: true, mode: "edit", song });
  }
  function closeForm() {
    setFormState((prev) => ({ ...prev, open: false }));
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <AdminSidebar
        activeTab={tab}
        onTabChange={setTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminTopBar
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-6">
          <div className="flex h-full min-h-0 flex-col gap-4">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  {tab === "all"
                    ? "All Songs"
                    : tab === "popular"
                      ? "Popular Songs"
                      : "Trending Songs"}
                </h2>
                <p className="mt-0.5 text-xs text-white/50 sm:text-sm">
                  {displayedSongs.length} song
                  {displayedSongs.length === 1 ? "" : "s"}
                  {isSearching && ` matching "${debouncedQuery.trim()}"`}
                </p>
              </div>
              <button
                onClick={openCreate}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Upload song</span>
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <OverlayScrollbarsComponent
                className="h-full w-full"
                options={{
                  scrollbars: {
                    theme: "os-theme-light",
                    autoHide: "leave",
                    autoHideDelay: 0,
                  },
                  overflow: { x: "hidden", y: "scroll" },
                }}
                defer
              >
                {displayedLoading ? (
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SongRowSkeleton key={i} />
                    ))}
                  </div>
                ) : displayedError ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <Music2 className="h-8 w-8 text-red-400/60" />
                    <p className="text-sm text-red-400">
                      Couldn&apos;t load songs. Please try again.
                    </p>
                  </div>
                ) : displayedSongs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <Music2 className="h-8 w-8 text-white/20" />
                    <p className="text-sm text-white/40">
                      {searchQuery.trim()
                        ? "No songs match your search."
                        : "No songs found."}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {displayedSongs.map((song) => {
                      const isPlaying = playingId === song.id;
                      return (
                        <div
                          key={song.id}
                          className="rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/[0.07]"
                        >
                          <div className="flex items-center gap-2.5 p-2.5 sm:gap-3 sm:p-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/40 sm:h-14 sm:w-14">
                              <SongCover
                                src={song.coverImage}
                                alt={song.title}
                                fill
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-white">
                                {song.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-white/50">
                                {song.artists.join(", ")}
                              </p>
                              <div className="mt-1 hidden flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/40 sm:flex">
                                <span>{song.playCount} plays</span>
                                {song.language && (
                                  <span className="capitalize">
                                    {song.language}
                                  </span>
                                )}
                                {song.genres?.length ? (
                                  <span className="truncate">
                                    {song.genres.join(", ")}
                                  </span>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                              <button
                                onClick={() =>
                                  setPlayingId(isPlaying ? null : song.id)
                                }
                                aria-label={
                                  isPlaying ? "Hide player" : "Preview song"
                                }
                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9 ${
                                  isPlaying
                                    ? "bg-purple-600 text-white"
                                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                                }`}
                              >
                                <Play
                                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                                  fill={isPlaying ? "currentColor" : "none"}
                                />
                              </button>
                              <button
                                onClick={() => openEdit(song)}
                                aria-label="Edit song"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white sm:h-9 sm:w-9"
                              >
                                <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() => setConfirmingDeleteId(song.id)}
                                aria-label="Delete song"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-red-400 transition-colors hover:bg-red-950/40 sm:h-9 sm:w-9"
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </div>

                          {isPlaying && (
                            <div className="border-t border-white/10 px-2.5 py-2.5 sm:px-3 sm:py-3">
                              <audio
                                controls
                                autoPlay
                                src={song.audioUrl}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </OverlayScrollbarsComponent>
            </div>
          </div>
        </div>
      </div>

      {confirmingDeleteId && (
        <ConfirmDialog
          open={!!confirmingDeleteId}
          title="Delete this song?"
          description="This can't be undone. It will also be removed from any playlists containing it."
          confirmLabel="Delete"
          onConfirm={async () => {
            try {
              await deleteSong(confirmingDeleteId).unwrap();
              toast.success("Song deleted");
            } catch (err: any) {
              toast.error(err?.data?.error || "Failed to delete song");
            }
            setConfirmingDeleteId(null);
          }}
          onCancel={() => setConfirmingDeleteId(null)}
        />
      )}

      <SongUpload
        isOpen={formState.open}
        mode={formState.mode}
        song={formState.song}
        onClose={closeForm}
      />
    </div>
  );
}
