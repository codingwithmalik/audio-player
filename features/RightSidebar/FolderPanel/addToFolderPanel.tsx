"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  X,
  Search,
  FolderPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import {
  addPlaylist,
  selectPlaylists,
  setPlaylistFolder,
} from "@/features/Playlist/playlistSlice";
import { selectFolderById } from "@/features/Folder/folderSlice";
import SongCover from "@/features/Common/SongCover";
import type { RootState } from "@/store/store";
import type { Playlist } from "@/types/playlist";

type TabType = "playlists" | "otherFolders";

export default function AddToFolderPanel({ folderId }: { folderId: string }) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("playlists");
  const [searchQuery, setSearchQuery] = useState("");

  const targetFolder = useAppSelector((state: RootState) =>
    selectFolderById(state, folderId),
  );

  const currentUserId = useAppSelector(
    (state: RootState) => state.auth.user?.id,
  );
  const allPlaylists = useAppSelector(selectPlaylists);

  // Scope to the current user's own playlists, and exclude the special
  // "Liked Songs" playlist — that one isn't meant to be organized into folders.
  const ownedPlaylists = useMemo(
    () =>
      allPlaylists.filter(
        (p) => p.ownerId === currentUserId && p.id !== `liked-${currentUserId}`,
      ),
    [allPlaylists, currentUserId],
  );

  const currentTabPlaylists = useMemo(
    () =>
      ownedPlaylists.filter((p) =>
        activeTab === "playlists" ? p.folderId === null : p.folderId !== null,
      ),
    [ownedPlaylists, activeTab],
  );

  const displayedPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return currentTabPlaylists;
    const q = searchQuery.toLowerCase();
    return currentTabPlaylists.filter((p) => p.title.toLowerCase().includes(q));
  }, [currentTabPlaylists, searchQuery]);

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

  const togglePlaylist = (playlist: Playlist) => {
    if (playlist.folderId === folderId) {
      dispatch(setPlaylistFolder({ playlistId: playlist.id, folderId: null }));
    } else {
      dispatch(setPlaylistFolder({ playlistId: playlist.id, folderId }));
    }
  };

  const handleCreatePlaylist = () => {
    if (!currentUserId) return;
    const action = dispatch(addPlaylist({ title: "New Playlist", ownerId: currentUserId }));
    dispatch(setPlaylistFolder({ playlistId: action.payload.id, folderId }));
  };

  // Tabs scrolling logic
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (tabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsScrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
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
        <h2 className="truncate text-base font-bold">
          Add to {targetFolder?.title ?? "folder"}
        </h2>
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

      {/* Create Playlist */}
      <div className="shrink-0 px-4 pb-4">
        <button
          onClick={handleCreatePlaylist}
          className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-white/10">
            <FolderPlus size={20} className="text-white/70" />
          </div>
          <span className="text-[15px] font-medium text-white">
            Create playlist
          </span>
        </button>
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
            active={activeTab === "playlists"}
            onClick={() => setActiveTab("playlists")}
          >
            Playlists
          </TabButton>
          <TabButton
            active={activeTab === "otherFolders"}
            onClick={() => setActiveTab("otherFolders")}
          >
            Playlists from other folders
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

      {/* Playlist List */}
      <div
        ref={scrollContainerRef}
        className="mt-2 min-h-0 flex-1 px-4"
        data-overlayscrollbars-initialize
      >
        <div className="flex flex-col gap-1 pb-6">
          {displayedPlaylists.length === 0 && (
            <div className="mt-10 text-center text-sm text-white/40">
              No playlists found.
            </div>
          )}
          {displayedPlaylists.map((playlist) => (
            <PlaylistRow
              key={playlist.id}
              playlist={playlist}
              isAdded={playlist.folderId === folderId}
              onToggle={() => togglePlaylist(playlist)}
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

function PlaylistRow({
  playlist,
  isAdded,
  onToggle,
}: {
  playlist: Playlist;
  isAdded: boolean;
  onToggle: () => void;
}) {
  const currentFolder = useAppSelector((state: RootState) =>
    playlist.folderId ? selectFolderById(state, playlist.folderId) : null,
  );

  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-white/5">
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3"
        onClick={onToggle}
      >
        <div className="shrink-0 overflow-hidden rounded-sm">
          <SongCover src={playlist.coverImage} alt={playlist.title} size={48} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="truncate text-[15px] font-medium text-white">
            {playlist.title}
          </p>
          {currentFolder && (
            <p className="mt-0.5 truncate text-[13px] text-white/60">
              From {currentFolder.title}
            </p>
          )}
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
