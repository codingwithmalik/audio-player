"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import {
  selectPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  selectLikedPlaylistId,
} from "@/features/Playlist/playlistSlice";
import { selectRecentSongIds } from "@/slices/historySlice";
import SongCover from "@/features/Common/SongCover";
import type { RootState } from "@/store/store";
import type { Song } from "@/types/song";
import { selectSongs } from "@/features/Songs/songsSlice";

type TabType = "recentlyPlayed" | "liked" | "suggested";

export default function AddToPlaylistPanel({
  playlistId,
}: {
  playlistId: string;
}) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("suggested");
  const [searchQuery, setSearchQuery] = useState("");

  const targetPlaylist = useAppSelector((state: RootState) =>
    selectPlaylistById(state, playlistId),
  );
  const targetSongIds = useMemo(() => {
    return new Set(targetPlaylist?.songs.map((s) => s.songId) || []);
  }, [targetPlaylist]);

  const recentIds = useAppSelector(selectRecentSongIds);
  const likedPlaylistId = useAppSelector(selectLikedPlaylistId);
  const likedPlaylist = useAppSelector((state: RootState) =>
    likedPlaylistId ? selectPlaylistById(state, likedPlaylistId) : null,
  );
  const likedIds = likedPlaylist?.songs.map((s) => s.songId) || [];
  const allSongs = useAppSelector(selectSongs);

  // Determine which IDs to show based on active tab
  const getTabSongIds = () => {
    switch (activeTab) {
      case "recentlyPlayed":
        return recentIds;
      case "liked":
        return likedIds;
      case "suggested":
        return allSongs.map((s) => s.id);
      default:
        return [];
    }
  };

  const currentTabIds = getTabSongIds();

  // We need the full Song objects to filter by search query
  const displayedSongs = useMemo(() => {
    const rawIds = currentTabIds;
    // Map to actual songs and filter nulls
    const mapped = rawIds
      .map((id) => allSongs.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => !!s);

    if (!searchQuery.trim()) return mapped;

    const q = searchQuery.toLowerCase();
    return mapped.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artists.some((a) => a.toLowerCase().includes(q)),
    );
  }, [currentTabIds, allSongs, searchQuery]);

  // Scrollbars
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [initOS] = useOverlayScrollbars({
    options: {
      scrollbars: {
        theme: "os-theme-light",
        autoHide: "leave",
        autoHideDelay: 0,
      },
    },
    defer: false,
  });

  useEffect(() => {
    if (scrollContainerRef.current) initOS(scrollContainerRef.current);
  }, [initOS]);

  const handleClose = () => dispatch(closeRightSidebarPanel());

  const toggleSong = (songId: string) => {
    if (targetSongIds.has(songId)) {
      dispatch(removeSongFromPlaylist({ playlistId, songId }));
    } else {
      dispatch(addSongToPlaylist({ playlistId, songId }));
    }
  };

  // Tabs Scrolling Logic
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (tabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Small buffer for rounding errors
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsScrollRef.current) {
      const scrollAmount = tabsScrollRef.current.scrollWidth;
      tabsScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col text-white">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-4">
        <h2 className="text-base font-bold">Add to playlist</h2>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="shrink-0 px-4 pb-4">
        <div className="relative flex w-full items-center overflow-hidden rounded-md bg-white/10">
          <div className="absolute left-3 text-white/50">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="relative flex shrink-0 items-center px-4 pb-2">
        <button
          onClick={() => scrollTabs("left")}
          className={`absolute left-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 backdrop-blur-md text-white shadow-lg transition-all duration-300 ${
            canScrollLeft
              ? "opacity-100 translate-x-0"
              : "pointer-events-none -translate-x-2 opacity-0"
          }`}
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={tabsScrollRef}
          onScroll={updateScrollButtons}
          className="flex w-full gap-2 overflow-x-auto whitespace-nowrap scroll-smooth [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <TabButton
            active={activeTab === "suggested"}
            onClick={() => setActiveTab("suggested")}
          >
            Suggested songs
          </TabButton>
          <TabButton
            active={activeTab === "recentlyPlayed"}
            onClick={() => setActiveTab("recentlyPlayed")}
          >
            Recently played
          </TabButton>
          <TabButton
            active={activeTab === "liked"}
            onClick={() => setActiveTab("liked")}
          >
            From your Liked Songs
          </TabButton>
        </div>

        <button
          onClick={() => scrollTabs("right")}
          className={`absolute right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg transition-all duration-300 ${
            canScrollRight
              ? "opacity-100 translate-x-0"
              : "pointer-events-none translate-x-2 opacity-0"
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Track List */}
      <div
        ref={scrollContainerRef}
        className="mt-2 min-h-0 flex-1 px-4"
        data-overlayscrollbars-initialize
      >
        <div className="flex flex-col gap-1 pb-6">
          {displayedSongs.length === 0 && (
            <div className="mt-10 text-center text-sm text-white/40">
              No songs found.
            </div>
          )}
          {displayedSongs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              isAdded={targetSongIds.has(song.id)}
              onToggle={() => toggleSong(song.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
        active
          ? "bg-white font-medium text-black"
          : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function SongRow({
  song,
  isAdded,
  onToggle,
}: {
  song: Song;
  isAdded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-white/5">
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
        onClick={onToggle}
      >
        <div className="shrink-0 overflow-hidden rounded-sm">
          <SongCover src={song.coverImage} alt={song.title} size={48} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="truncate text-[15px] font-medium text-white">
            {song.title}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <p className="truncate text-[13px] text-white/60">
              {song.artists.join(", ")}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center"
      >
        {isAdded ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-black">
            <Check size={12} strokeWidth={3} />
          </div>
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors group-hover:border-white group-hover:text-white">
            <Plus size={14} />
          </div>
        )}
      </button>
    </div>
  );
}
