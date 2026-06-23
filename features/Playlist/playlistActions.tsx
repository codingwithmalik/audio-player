"use client";

/**
 * PlaylistActions
 * ---------------
 * Row 1: Play | Shuffle | Download | More — Search bar (inline) — Sort | View toggle
 * Row 2: + Add | ✏️ Name & details
 *
 * Search bar: replaces the right cluster inline when toggled — no second row.
 * Sort dropdown: custom glass dropdown with sort options + asc/desc on re-click.
 * View toggle: cycles between List and Grid — dispatched from page.
 *
 * All Redux dispatches happen in the page — this component emits callbacks.
 */

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  Play,
  Pause,
  Shuffle,
  Download,
  MoreHorizontal,
  Search,
  X,
  Plus,
  Pencil,
  ChevronUp,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Check,
} from "lucide-react";
import {
  SortBy,
  ViewMode,
  setSearchQuery,
  setSortBy,
  setViewMode,
  selectSortBy,
  selectSortDir,
  selectViewMode,
} from "@/features/Playlist/playlistSlice";
import {
  selectIsShuffle,
  selectSourceId,
  setSong,
  setSourceId,
  setSourceType,
  togglePlay,
  toggleShuffle,
} from "@/store/playerSlice";
import { useParams } from "next/navigation";
import { Song } from "@/types/song";

// ─── Sort option config ───────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "custom", label: "Custom order" },
  { value: "title", label: "Title" },
  { value: "artist", label: "Artist" },
  { value: "recentlyAdded", label: "Recently added" },
  { value: "duration", label: "Duration" },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface PlaylistActionsProps {
  isPlaying: boolean;
  onEditDetails: () => void;
  songs: Song[];
}
// ─── Component ────────────────────────────────────────────────────────────────

export default function PlaylistActions({
  isPlaying,
  onEditDetails,
  songs,
}: PlaylistActionsProps) {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // ── Read UI state from store ────────────────────────────────────────────────
  const sortBy = useAppSelector(selectSortBy);
  const sortDir = useAppSelector(selectSortDir);
  const viewMode = useAppSelector(selectViewMode);
  const sourceId = useAppSelector(selectSourceId);
  const isShuffle = useAppSelector(selectIsShuffle);

  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Focus search input when it opens
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  // ── Search / sort / view handlers — dispatch to Redux ──────────────────────
  const handlePlay = () => {
    console.log("play playlist" + " first song is " + songs.at(0)?.id);
    const firstSongId = songs.at(0)?.id;
    if (!firstSongId) return;
    if (sourceId !== id) {
      dispatch(setSourceId(id));
      dispatch(setSourceType("playlist"));
      dispatch(setSong(firstSongId));
    } else {
      dispatch(togglePlay());
    }
  };

  const handleShuffle = () => {
    console.log("shuffle playlist");
    dispatch(toggleShuffle());
  };

  const handleSortChange = (newSortBy: SortBy) => {
    dispatch(setSortBy(newSortBy));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    dispatch(setViewMode(mode));
  };

  const handleSearchToggle = () => {
    if (searchOpen) {
      dispatch(setSearchQuery(""));
      setSearchOpen((v) => !v);
    } else {
      setSearchOpen((v) => !v);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleAddSong = () => {
    // TODO: open add song modal
    console.log("add song to playlist");
  };

  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Custom order";

  return (
    <div className="flex flex-col px-6 py-4 gap-3">
      {/* ── Row 1 ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: playback controls — always visible */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Play / Pause */}
          <button
            onClick={handlePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center
                       shadow-lg hover:scale-105 active:scale-95 transition-transform duration-150
                       hover:bg-white shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black fill-black" />
            ) : (
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={handleShuffle}
            aria-label="Shuffle"
            className={` hover:scale-105 active:scale-95
                       transition-all duration-150 ${isShuffle ? "text-purple-500" : "text-white/60 hover:text-white"}`}
          >
            <Shuffle className="w-6 h-6" />
          </button>

          <button
            aria-label="Download"
            className="text-white/60 hover:text-white transition-colors duration-150"
          >
            <Download className="w-6 h-6" />
          </button>

          <button
            aria-label="More options"
            className="text-white/60 hover:text-white transition-colors duration-150"
          >
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Right: search bar (inline) + sort + view */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Search bar — expands inline, collapses to icon */}
          <div className="flex items-center">
            {searchOpen ? (
              /* Expanded search input */
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  onChange={handleQueryChange}
                  placeholder="Search in playlist"
                  className="w-48 sm:w-56 bg-white/10 border border-white/20 rounded-lg
                             pl-9 pr-8 py-2 text-sm text-white placeholder:text-white/30
                             focus:outline-none focus:border-white/40 focus:bg-white/15
                             transition-all duration-200"
                />
                <button
                  onClick={handleSearchToggle}
                  aria-label="Close search"
                  className="absolute right-2 text-white/40 hover:text-white
                             transition-colors duration-150"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Collapsed — just the icon */
              <button
                onClick={handleSearchToggle}
                aria-label="Search in playlist"
                className="text-white/60 hover:text-white hover:scale-105
                           transition-all duration-150"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-label="Sort options"
              className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white
                         transition-colors duration-150 whitespace-nowrap"
            >
              <span className="hidden sm:inline">{activeSortLabel}</span>
              <LayoutList className="w-5 h-5" />
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-82 mt-2 w-52 z-500
                           bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl
                           py-2 overflow-hidden"
              >
                {/* Sort by section */}
                <p
                  className="text-[11px] text-white/40 font-semibold uppercase
                               tracking-wider px-4 py-1.5"
                >
                  Sort by
                </p>
                {SORT_OPTIONS.map((opt) => {
                  const isActive = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        handleSortChange(opt.value);
                        // keep dropdown open so user can see dir change
                        if (opt.value === "custom") setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5
                                 text-sm hover:bg-white/10 transition-colors duration-100
                                 text-left"
                    >
                      <span
                        className={
                          isActive
                            ? "text-purple-600 font-medium"
                            : "text-white"
                        }
                      >
                        {opt.label}
                      </span>
                      <span className="flex items-center gap-1">
                        {isActive &&
                          opt.value !== "custom" &&
                          (sortDir === "asc" ? (
                            <ChevronUp className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-purple-600" />
                          ))}
                        {isActive && opt.value === "custom" && (
                          <Check className="w-3.5 h-3.5 text-purple-600" />
                        )}
                      </span>
                    </button>
                  );
                })}

                {/* Divider */}
                <div className="border-t border-white/10 my-2" />

                {/* View as section */}
                <p
                  className="text-[11px] text-white/40 font-semibold uppercase
                               tracking-wider px-4 py-1.5"
                >
                  View as
                </p>
                {(["list", "grid"] as ViewMode[]).map((mode) => {
                  const isActive = viewMode === mode;
                  const Icon = mode === "list" ? LayoutList : LayoutGrid;
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        handleViewModeChange(mode);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5
                                 text-sm hover:bg-white/10 transition-colors duration-100"
                    >
                      <span className="flex items-center gap-2">
                        <Icon
                          className={`w-4 h-4 ${isActive ? "text-purple-600" : "text-white/60"}`}
                        />
                        <span
                          className={
                            isActive
                              ? "text-purple-600 font-medium capitalize"
                              : "text-white capitalize"
                          }
                        >
                          {mode}
                        </span>
                      </span>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-purple-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: edit controls ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleAddSong}
          aria-label="Add songs"
          className="flex items-center gap-2 text-sm text-white/70 font-medium
                     border border-white/20 rounded-full px-4 py-1.5
                     hover:border-white/50 hover:text-white transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>

        <button
          onClick={onEditDetails}
          aria-label="Edit playlist details"
          className="flex items-center gap-2 text-sm text-white/70 font-medium
                     border border-white/20 rounded-full px-4 py-1.5
                     hover:border-white/50 hover:text-white transition-colors duration-150"
        >
          <Pencil className="w-4 h-4" />
          Edit Details
        </button>
      </div>
    </div>
  );
}
