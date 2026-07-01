"use client";

import {
  Download,
  ListPlus,
  LucideIcon,
  Pencil,
  Trash2,
  Plus,
  FolderClosed,
  ChevronRight,
  ListMusic,
  FolderMinus,
  ChevronLeft,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  removePlaylist,
  selectPlaylists,
  addPlaylist,
  setPlaylistFolder,
  selectPlaylistById,
  addSongsToPlaylist,
} from "./playlistSlice";
import { useRouter } from "next/navigation";
import {
  addFolder,
  addPlaylistToFolder,
  removePlaylistFromFolder,
  selectFolders,
} from "@/features/Folder/folderSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog";

// ─── Types ────────────────────────────────────────────────────────────────────
type SheetView = "main" | "move-folder" | "add-playlist";

type Option = {
  id: string;
  label?: string;
  icon?: LucideIcon;
  action?: () => void;
  separatorAbove?: boolean;
  submenu?: SubOption[];
};

type SubOption = {
  id: string;
  label?: string;
  icon?: LucideIcon;
  action?: () => void;
  separatorAbove?: boolean;
  searchable?: boolean;
};

// ─── Submenu ──────────────────────────────────────────────────────────────────

function Submenu({
  options,
  searchPlaceholder,
  inline = false,
}: {
  options: SubOption[];
  searchPlaceholder: string;
  inline?: boolean;
}) {
  const [query, setQuery] = useState("");

  const searchable = options.find((o) => o.searchable);
  const items = options
    .filter((o) => !o.searchable)
    .filter((o) =>
      query.trim()
        ? o.label?.toLowerCase().includes(query.toLowerCase())
        : true,
    );

  return (
    <div
      className={
        inline
          ? "w-full py-1"
          : "absolute left-full top-0 ml-1 w-64 bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-600"
      }
    >
      {/* Search input */}
      {searchable && (
        <div className="px-3 pb-2 max-md:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-purple-600 transition-colors"
          />
        </div>
      )}

      {/* Scrollable list */}
      <OverlayScrollbarsComponent
        options={{ scrollbars: { autoHide: "scroll" } }}
        style={{ maxHeight: 220 }}
      >
        {items.map((sub) => {
          const SubIcon = sub.icon;
          return (
            <React.Fragment key={sub.id}>
              <button
                onClick={sub.action}
                className="group/sub w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
              >
                {SubIcon && (
                  <SubIcon className="w-4 h-4 text-white/60 group-hover/sub:text-purple-600 transition-colors" />
                )}
                <span className="text-white group-hover/sub:text-purple-600 transition-colors truncate">
                  {sub.label}
                </span>
              </button>
              {sub.separatorAbove && (
                <div className="border-t border-white/10" />
              )}
            </React.Fragment>
          );
        })}

        {/* Empty state */}
        {items.length === 0 && (
          <p className="px-4 py-3 text-xs text-white/30">No results</p>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlaylistMoreOptions({
  onEditDetails,
  currentFolderId,
  playlistId,
  onDownload,
  onClose,
  variant = "dropdown", // new
}: {
  playlistId: string;
  currentFolderId: string | null;
  onEditDetails: () => void;
  onDownload: () => void;
  onClose: () => void;
  variant?: "dropdown" | "sheet";
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const folders = useAppSelector(selectFolders);
  const now = new Date().toISOString();
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");

  // Pull folders from librarySlice — no more mockData

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<SheetView>("main");

  // ── Outside click closes the whole menu ───────────────────────────────────
  useEffect(() => {
    console.log("PlaylistMoreOptions mounted");
    const handler = (e: MouseEvent) => {
      if (confirmOpen) return;
      if (!wrapperRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, confirmOpen]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAddToQueue = () => {
    // dispatch(addToQueue(playlistId)) — wire when queueSlice is ready
    console.log("Add to Queue Clicked");
    onClose();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
    console.log("Delete Clicked");
    // onClose();
  };
  const confirmDelete = () => {
    console.log("Delete Confirmed");
    dispatch(removePlaylist(playlistId));
    setConfirmOpen(false);
    router.push("/");
    // onClose();
  };

  const handleCreateFolder = () => {
    const newFolderId = crypto.randomUUID();
    dispatch(
      addFolder({
        id: newFolderId,
        type: "folder",
        title: "New Folder " + (folders.length + 1),
        playlistIds: [],
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    handleAddToFolder(newFolderId);
    onClose();
  };
  const handleRemoveFromFolder = () => {
    if (!currentFolderId) return;
    dispatch(
      removePlaylistFromFolder({ folderId: currentFolderId, playlistId }),
    );
    dispatch(setPlaylistFolder({ playlistId, folderId: null }));
    onClose();
  };
  const handleAddToFolder = (folderId: string) => {
    if (currentFolderId) handleRemoveFromFolder();
    dispatch(addPlaylistToFolder({ folderId, playlistId }));
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    onClose();
  };

  const handleCreatePlaylist = () => {
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

  const sourcePlaylist = useAppSelector((state) =>
    selectPlaylistById(state, playlistId),
  );

  const handleAddToPlaylist = (targetPlaylistId: string) => {
    if (!sourcePlaylist) return;
    dispatch(
      addSongsToPlaylist({
        targetPlaylistId,
        songs: sourcePlaylist.songs,
      }),
    );
    onClose();
  };
  const handleOptionEnter = (option: Option) => {
    if (variant === "sheet") return; // no hover behavior on mobile
    if (option.submenu) {
      setActiveSubmenu(option.id);
    } else {
      // Hovering a non-submenu option closes any open submenu
      setActiveSubmenu(null);
    }
  };
  // ── Options config ────────────────────────────────────────────────────────
  const options: Option[] = [
    {
      id: "queue",
      label: "Add to queue",
      icon: ListPlus,
      action: handleAddToQueue,
    },
    {
      id: "download",
      label: "Download",
      icon: Download,
      action: () => {
        onDownload();
        onClose();
      },
    },
    {
      id: "edit",
      label: "Edit Details",
      icon: Pencil,
      action: () => {
        onEditDetails();
        onClose();
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: handleDelete,
    },
    {
      id: "move-folder",
      label: "Move to folder",
      icon: FolderClosed,
      submenu: [
        { id: "search", searchable: true },
        {
          id: "new-folder",
          label: "New Folder",
          icon: Plus,
          action: handleCreateFolder,
          separatorAbove: true,
        },
        // Only shown if the playlist is currently inside a folder
        ...(currentFolderId
          ? [
              {
                id: "remove-folder",
                label: "Remove from Folder",
                icon: FolderMinus, // import from lucide-react
                action: handleRemoveFromFolder,
                separatorAbove: true,
              } as Option,
            ]
          : []),

        ...folders.map((folder) => ({
          id: folder.id,
          label: folder.title,
          action: () => handleAddToFolder(folder.id),
        })),
      ],
    },
    {
      id: "add-playlist",
      label: "Add to other playlist",
      icon: ListMusic,
      submenu: [
        { id: "search", searchable: true },
        {
          id: "new-playlist",
          label: "New Playlist",
          icon: Plus,
          action: handleCreatePlaylist,
          separatorAbove: true,
        },
        ...playlists
          .filter((p) => p.id !== playlistId) // exclude current playlist
          .map((p) => ({
            id: p.id,
            label: p.title,
            action: () => handleAddToPlaylist(p.id),
          })),
      ],
    },
  ];

  return (
    <div ref={wrapperRef}>
      {(variant === "dropdown" || sheetView === "main") &&
        options.map((option) => {
          const Icon = option.icon;
          const isSubmenuOpen = activeSubmenu === option.id;

          return (
            <div
              key={option.id}
              className="relative"
              onMouseEnter={() => handleOptionEnter(option)}
              // onMouseLeave={() => setActiveSubmenu(null)}
            >
              {option.separatorAbove && (
                <div className="border-t border-white/10 my-1.5" />
              )}

              <button
                onClick={
                  option.submenu && variant === "sheet"
                    ? () => setSheetView(option.id as SheetView)
                    : option.submenu
                      ? undefined
                      : option.action
                }
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors duration-150 text-white hover:text-purple-600
              }`}
              >
                <span className="flex items-center gap-3">
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 transition-colors  hover:text-purple-600
                    }`}
                    />
                  )}
                  <span>{option.label}</span>
                </span>

                {option.submenu && (
                  <ChevronRight className="w-4 h-4  hover:text-purple-600" />
                )}
              </button>

              {/* Submenu — rendered only when active */}
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
                    searchPlaceholder={
                      option.id === "move-folder"
                        ? "Find a folder"
                        : "Find a playlist"
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      {variant === "sheet" && sheetView !== "main" && (
        <>
          <button
            onClick={() => setSheetView("main")}
            className="flex items-center gap-2 px-4 py-3 text-sm text-white/60 hover:text-white transition-colors w-full"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="border-t border-white/10 mb-2" />
          <Submenu
            inline
            options={options.find((o) => o.id === sheetView)!.submenu!}
            searchPlaceholder={
              sheetView === "move-folder" ? "Find a folder" : "Find a playlist"
            }
          />
        </>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete from Your Library?"
        description={
          <>
            This will delete{" "}
            <span className="font-semibold text-white">
              {sourcePlaylist?.title}
            </span>{" "}
            from <span className="font-semibold text-white">Your Library</span>.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
