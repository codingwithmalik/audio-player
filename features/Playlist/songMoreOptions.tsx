"use client";

import {
  ListPlus,
  ListMusic,
  Heart,
  Trash2,
  Link,
  Plus,
  LucideIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  addPlaylist,
} from "@/features/Playlist/playlistSlice";
import {
  toggleLike,
  selectIsLiked,
} from "@/features/LikedSongs/likedSongsSlice";
import { addToQueue } from "@/features/RightSidebar/Queue/queueSlice";
import type { RootState } from "@/store/store";
import Submenu, { SubOption } from "@/features/Common/Submenu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Option = {
  id: string;
  label?: string;
  icon?: LucideIcon;
  iconFilled?: boolean;
  action?: () => void;
  separatorAbove?: boolean;
  submenu?: SubOption[];
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SongMoreOptions({
  songId,
  playlistId,
  onClose,
  variant = "dropdown",
}: {
  songId: string;
  playlistId: string; // the playlist this song lives in
  onClose: () => void;
  variant?: "dropdown" | "sheet";
}) {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const isLiked = useAppSelector((state: RootState) =>
    selectIsLiked(state, songId),
  );

  // Is this song in the current playlist
  const currentPlaylist = useAppSelector(
    (state: RootState) => state.playlists.entities[playlistId] ?? null,
  );
  const isInPlaylist =
    currentPlaylist?.songs.some((s) => s.songId === songId) ?? false;
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<SheetView>("main");

  type SheetView = "main" | "add-playlist";
  const now = new Date().toISOString();

  // ── Outside click ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleToggleLike = () => {
    dispatch(toggleLike(songId));
    onClose();
  };

  const handleAddToQueue = () => {
    dispatch(addToQueue(songId));
    onClose();
  };

  const handleRemoveFromPlaylist = () => {
    dispatch(removeSongFromPlaylist({ playlistId, songId }));
    onClose();
  };

  const handleAddToPlaylist = (targetPlaylistId: string) => {
    dispatch(addSongToPlaylist({ playlistId: targetPlaylistId, songId }));
    onClose();
  };

  const handleCreatePlaylist = () => {
    // dispatch(addPlaylist + addSongToPlaylist) — wire when needed
    const newPlaylistId = crypto.randomUUID();
    dispatch(
      addPlaylist({
        id: newPlaylistId,
        type: "playlist",
        title: "New Playlist " + (playlists.length + 1),
        description: "",
        coverImage: "",
        songs: [],
        folderId: null,
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    handleAddToPlaylist(newPlaylistId);
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/songs/${songId}`);
    onClose();
  };

  const handleOptionEnter = (option: Option) => {
    if (variant === "sheet") return;
    setActiveSubmenu(option.submenu ? option.id : null);
  };

  // ── Options ───────────────────────────────────────────────────────────────
  const addToPlaylistSubmenu: SubOption[] = [
    { id: "search", searchable: true },
    {
      id: "new-playlist",
      label: "New Playlist",
      icon: Plus,
      action: handleCreatePlaylist,
      separatorAbove: true,
    },
    ...playlists
      .filter((p) => p.id !== playlistId)
      .map((p) => ({
        id: p.id,
        label: p.title,
        action: () => handleAddToPlaylist(p.id),
      })),
  ];

  const options: Option[] = [
    {
      id: "add-playlist",
      label: "Add to playlist",
      icon: ListMusic,
      submenu: addToPlaylistSubmenu,
    },
    ...(isInPlaylist
      ? [
          {
            id: "remove-playlist",
            label: "Remove from this playlist",
            icon: Trash2,
            action: handleRemoveFromPlaylist,
          } as Option,
        ]
      : []),
    {
      id: "like",
      label: isLiked ? "Remove from Liked Songs" : "Save to Liked Songs",
      icon: Heart,
      iconFilled: isLiked,
      action: handleToggleLike,
      separatorAbove: true,
    },
    {
      id: "queue",
      label: "Add to queue",
      icon: ListPlus,
      action: handleAddToQueue,
    },
    {
      id: "copy-link",
      label: "Copy song link",
      icon: Link,
      action: handleCopyLink,
      separatorAbove: true,
    },
  ];

  return (
    <div ref={wrapperRef}>
      {/* ── Main options — hidden on sheet when in submenu view ── */}
      {(variant === "dropdown" || sheetView === "main") &&
        options.map((option) => {
          const Icon = option.icon;
          const isSubmenuOpen = activeSubmenu === option.id;

          return (
            <div
              key={option.id}
              className="relative"
              onMouseEnter={() => handleOptionEnter(option)}
            >
              {option.separatorAbove && (
                <div className="border-t border-white/10" />
              )}

              <button
                onClick={
                  option.submenu && variant === "sheet"
                    ? () => setSheetView(option.id as SheetView)
                    : option.submenu
                      ? undefined
                      : option.action
                }
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors duration-150
                     text-white hover:text-purple-600 group
                `}
              >
                <span className="flex items-center gap-3 ">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 transition-colors group-hover:text-purple-600 ${
                        option.iconFilled
                          ? "text-purple-600 fill-purple-600"
                          : "text-white/60"
                      }`}
                    />
                  )}
                  <span>{option.label}</span>
                </span>
                {option.submenu && (
                  <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-purple-600" />
                )}
              </button>

              {/* Desktop submenu */}
              {option.submenu && (
                <div
                  className={`transition-opacity duration-150 ${
                    isSubmenuOpen
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Submenu
                    options={option.submenu}
                    searchPlaceholder="Find a playlist"
                    maxHeight={220}
                    position="left"
                  />
                </div>
              )}
            </div>
          );
        })}

      {/* ── Sheet submenu view ── */}
      {variant === "sheet" && sheetView !== "main" && (
        <>
          <button
            onClick={() => setSheetView("main")}
            className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white transition-colors w-full border-b border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <Submenu
            inline
            options={options.find((o) => o.id === sheetView)!.submenu!}
            searchPlaceholder="Find a playlist"
            maxHeight="100%"
            position="left"
          />
        </>
      )}
    </div>
  );
}
