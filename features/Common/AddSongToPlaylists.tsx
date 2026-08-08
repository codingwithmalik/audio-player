"use client";

import { Heart, Plus, Search, X, Check } from "lucide-react";
import { useRef, useState, useLayoutEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  selectPlaylistSongCovers,
  selectPlaylistById,
} from "@/features/Playlist/playlistSlice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheet from "@/features/Common/BottomSheet";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";
import type { RootState } from "@/store/store";
import {
  useAddSongToPlaylistMutation,
  useCreatePlaylistMutation,
  useGetPlaylistsQuery,
  useRemoveSongFromPlaylistMutation,
} from "../Playlist/playlistsApi";
import { toast } from "sonner";
// Managing Loading and Error states
import gsap from "gsap";
import PlaylistMenuRowSkeleton from "@/features/Common/Animations/PlaylistMenuRowSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";

// ─── Menu content ─────────────────────────────────────────────────────────────

function MenuContent({
  songId,
  onClose,
  setHoveredFalse,
}: {
  songId: string;
  onClose: () => void;
  setHoveredFalse?: () => void;
}) {
  const dispatch = useAppDispatch();
  const {
    isLoading: playlistsLoading,
    isError: playlistsError,
    refetch: refetchPlaylists,
  } = useGetPlaylistsQuery();
  const playlists = useAppSelector(selectPlaylists);
  const [addSongMutation] = useAddSongToPlaylistMutation();
  const [removeSongMutation] = useRemoveSongFromPlaylistMutation();
  const [createPlaylistMutation] = useCreatePlaylistMutation();

  const [query, setQuery] = useState("");

  // ── Pending changes — deferred until Done ────────────────────────────────
  // Map of playlistId → "add" | "remove" state
  const [pendingPlaylists, setPendingPlaylists] = useState<
    Record<string, "add" | "remove">
  >({});

  const hasChanges = Object.keys(pendingPlaylists).length > 0;

  // Effective state — pending overrides current

  const effectiveInPlaylist = (playlistId: string) => {
    if (pendingPlaylists[playlistId] === "add") return true;
    if (pendingPlaylists[playlistId] === "remove") return false;
    return (
      playlists
        .find((p) => p.id === playlistId)
        ?.songs.some((s) => s.songId === songId) ?? false
    );
  };

  const filtered = playlists.filter((p) =>
    query.trim() ? p.title.toLowerCase().includes(query.toLowerCase()) : true,
  );

  // ── Toggle handlers — only update pending state ───────────────────────────

  const handleTogglePlaylist = (playlistId: string) => {
    const current = effectiveInPlaylist(playlistId);
    setPendingPlaylists((prev) => {
      const next = { ...prev };
      const original =
        playlists
          .find((p) => p.id === playlistId)
          ?.songs.some((s) => s.songId === songId) ?? false;
      if (current === original) {
        // toggling away from original — add to pending
        next[playlistId] = current ? "remove" : "add";
      } else {
        // toggling back to original — remove from pending
        delete next[playlistId];
      }
      return next;
    });
  };

  const handleCreatePlaylist = async () => {
    try {
      const playlist = await createPlaylistMutation({
        title: "New Playlist " + (playlists.length + 1),
      }).unwrap();

      dispatch(addSongToPlaylist({ playlistId: playlist.id, songId }));
      addSongMutation({ playlistId: playlist.id, songIds: [songId] });
    } catch {
      toast.error("Failed to create playlist");
    }

    onClose();
  };

  // ── Commit all pending changes on Done ────────────────────────────────────
  const handleDone = () => {
    Object.entries(pendingPlaylists).forEach(([playlistId, action]) => {
      if (action === "add") {
        dispatch(addSongToPlaylist({ playlistId, songId }));
        addSongMutation({ playlistId, songIds: [songId] });
      } else {
        dispatch(removeSongFromPlaylist({ playlistId, songId }));
        removeSongMutation({ playlistId, songId });
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setHoveredFalse && setHoveredFalse();
    onClose();
  };

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="px-3 pt-2 pb-1">
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a playlist"
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X className="w-3.5 h-3.5 text-white/40 hover:text-white transition-colors" />
            </button>
          )}
        </div>
      </div>

      <OverlayScrollbarsComponent
        options={{ scrollbars: { autoHide: "scroll" } }}
        className="md:max-h-75"
      >
        {/* New playlist */}
        {!query && (
          <button
            onClick={handleCreatePlaylist}
            className="group w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-white/60" />
            </div>
            <span className="text-white group-hover:text-white/80">
              New playlist
            </span>
          </button>
        )}

        {!query && <div className="border-t border-white/10 my-1" />}

        {/* Playlists */}
        {playlistsError ? (
          <ErrorState
            message="Couldn't load your playlists."
            onRetry={refetchPlaylists}
            compact
          />
        ) : playlistsLoading ? (
          <PlaylistMenuRowSkeleton />
        ) : (
          <>
            {filtered.map((p) => (
              <PlaylistRow
                key={p.id}
                label={p.title}
                isChecked={effectiveInPlaylist(p.id)}
                onToggle={() => handleTogglePlaylist(p.id)}
                playlistId={p.id}
              />
            ))}
            {filtered.length === 0 && query && (
              <p className="px-4 py-3 text-xs text-white/30">
                No playlists found
              </p>
            )}
          </>
        )}

      </OverlayScrollbarsComponent>

      {/* Footer — Cancel always, Done only when changes exist */}
      <div className="border-t border-white/10 mt-1 px-3 py-2 flex items-center justify-end gap-2">
        <button
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            setHoveredFalse && setHoveredFalse();
            onClose();
          }}
          className="px-4 py-1.5 text-sm text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          Cancel
        </button>
        {hasChanges && (
          <button
            onClick={handleDone}
            className="px-4 py-1.5 text-sm font-semibold text-black bg-white rounded-full hover:bg-white/90 transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Playlist row ─────────────────────────────────────────────────────────────

function PlaylistRow({
  label,
  isChecked,
  onToggle,
  playlistId,
}: {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  playlistId: string;
}) {
  const isLikedRow = playlistId?.startsWith("liked-");
  const playlist = useAppSelector((state: RootState) =>
    selectPlaylistById(state, playlistId),
  );
  const songCovers = useAppSelector((state) =>
    selectPlaylistSongCovers(state, playlist),
  );

  return (
    <button
      onClick={onToggle}
      className="group w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors"
    >
      {/* Cover */}
      <div className="w-9 h-9 rounded-md overflow-hidden shrink-0">
        {isLikedRow ? (
          <div className="w-full h-full bg-linear-to-br from-purple-700 to-indigo-900 flex items-center justify-center">
            <Heart
              className={`w-4 h-4 text-white ${isChecked ? "fill-white" : ""}`}
            />
          </div>
        ) : (
          <PlaylistMosaicCover
            coverImage={playlist?.coverImage}
            songCovers={songCovers}
            title={label}
          />
        )}
      </div>

      {/* Label */}
      <span className="text-sm text-white flex-1 text-left truncate">
        {label}
      </span>

      {/* Check indicator */}
      {isChecked ? (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-black">
          <Check size={12} strokeWidth={3} />
        </div>
      ) : (
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors group-hover:border-white group-hover:text-white">
          <Plus size={14} />
        </div>
      )}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AddToPlaylistMenu({
  songId,
  setHoveredFalse,
}: {
  songId: string;
  setHoveredFalse?: () => void;
}) {
  const isMobile = useIsMobile();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const playlists = useAppSelector(selectPlaylists);
  const isInAnything = playlists.some((p) =>
    p.songs.some((s) => s.songId === songId),
  );

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !menuRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuWidth = 320;
      const menuHeight = menuRef.current.getBoundingClientRect().height;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const openAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
      const top = openAbove ? rect.top - menuHeight - 8 : rect.bottom + 8;

      // Clamp against the real viewport every time — this is the actual fix.
      // Before, this only ran once at open, so once the list grew (playlists
      // loading in, search results changing) nothing corrected the position.
      const maxTop = window.innerHeight - menuHeight - 8;
      setPos({
        top: Math.min(Math.max(8, top), Math.max(8, maxTop)),
        left: Math.max(
          8,
          Math.min(rect.left, window.innerWidth - menuWidth ),
        ),
      });
    };

    updatePosition();

    const observer = new ResizeObserver(updatePosition);
    observer.observe(menuRef.current);
    window.addEventListener("resize", updatePosition, true);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePosition, true);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  // Separate entrance animation — deliberately its own effect so it fires
  // once on open, not on every reposition from the observer above.
  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;
    gsap.fromTo(
      menuRef.current,
      { opacity: 0, y: -4 },
      { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
    );
  }, [open]);

  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => {
          setOpen((v) => !v);
          e.stopPropagation();
        }}
        aria-label="Add to playlist"
        className="flex items-center justify-center text-white/60 hover:text-white transition-colors duration-150"
      >
        {isInAnything ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-black">
            <Check size={12} strokeWidth={3} />
          </div>
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-white/70 transition-colors group-hover:border-white group-hover:text-white">
            <Plus size={14} />
          </div>
        )}
      </button>

      {isMobile ? (
        <BottomSheet
          isOpen={open}
          onClose={handleClose}
          title="Add to playlist"
        >
          <MenuContent
            songId={songId}
            onClose={handleClose}
            setHoveredFalse={setHoveredFalse}
          />
        </BottomSheet>
      ) : (
        open &&
        typeof window !== "undefined" &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-9998"
              onClick={() => {
                handleClose();
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                setHoveredFalse && setHoveredFalse();
              }}
            />
            <div
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: 320,
                zIndex: 9999,
              }}
              data-portal-menu
              ref={menuRef}
              className="bg-[#2C0E3B] border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40 px-4 py-2">
                Add to playlist
              </p>
              <MenuContent
                songId={songId}
                onClose={handleClose}
                setHoveredFalse={setHoveredFalse}
              />
            </div>
          </>,
          document.body,
        )
      )}
    </>
  );
}
