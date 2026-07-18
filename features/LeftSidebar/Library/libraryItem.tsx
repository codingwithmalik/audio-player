"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { FolderClosed, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/globalHooks";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { selectSongsByIds } from "@/features/Songs/songsSlice";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";
import { selectQueueSourceId } from "@/features/RightSidebar/Queue/queueSlice";
import { selectIsPlaying } from "@/store/playerSlice";
import EqBars from "@/features/Common/EQBars";
import { useDraggable, useDroppable } from "@dnd-kit/core";

type Props = {
  item: Folder | Playlist;
  depth?: number;
  isAnyDragActive?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

export default function LibraryItem({
  item,
  depth = 0,
  isAnyDragActive = false,
  isExpanded = false,
  onToggleExpand,
}: Props) {
  const router = useRouter();
  const isFolder = item.type === "folder";
  const isPlaylist = item.type === "playlist";
  const id = isPlaylist ? item.id : "";
  const playlist = useAppSelector((s) => selectPlaylistById(s, id));
  const songIds = playlist?.songs.map((s) => s.songId) ?? [];
  const songs = useAppSelector((s) => selectSongsByIds(s, songIds));
  const songCovers = songs.slice(0, 4).map((s) => s.coverImage);
  const songCoversStrings = songCovers.filter((c): c is string => Boolean(c));
  const queueSourceId = useAppSelector(selectQueueSourceId);
  const isPlaying = useAppSelector(selectIsPlaying);
  const isCurrent = queueSourceId === item.id;
  const isCurrentlyPlaying = isPlaying && isCurrent;

  const isLikedPlaylist = isPlaylist && item.id.startsWith("liked-");
  const canDrag = isPlaylist && !isLikedPlaylist;
  const href = isFolder ? `/folder/${item.id}` : `/playlist/${item.id}`;

  // Tracks whether a real drag happened during this pointer interaction —
  // set true the moment isDragging flips true, reset after the resulting
  // ghost click is swallowed. Fixes: releasing a drag with no valid drop
  // still fires a native browser click on mouseup, which would otherwise
  // navigate as if it were a normal click.
  const hasDraggedRef = useRef(false);

  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: item.id,
    disabled: !canDrag,
  });

  // eslint-disable-next-line react-hooks/refs
  if (isDragging) hasDraggedRef.current = true;

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: item.id,
    disabled: !isFolder,
  });

  function handleClick() {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false; // swallow this one ghost click, allow future real clicks
      return;
    }
    router.push(href);
  }

  const showAsValidTarget = isFolder && isAnyDragActive;
  const showAsHoveredTarget = isFolder && isOver;

  return (
    <div style={{ paddingLeft: depth * 24 }} className="flex items-center gap-1">
      <div
        ref={(node) => {
          if (canDrag) setDragRef(node);
          if (isFolder) setDropRef(node);
        }}
        {...(canDrag ? { ...attributes, ...listeners } : {})}
        onClick={handleClick}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push(href);
        }}
        className={`flex-1 min-w-0 ${isDragging ? "opacity-40" : ""}`}
      >
        <div
          className={`group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 transition cursor-pointer touch-pan-y ${
            showAsHoveredTarget
              ? "bg-purple-600/20 ring-1 ring-purple-500/50"
              : showAsValidTarget
                ? "ring-purple-600/20 ring-1 bg-purple-600/10"
                : "md:hover:bg-white/10"
          }`}
        >
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <div className="flex items-center justify-center transition-opacity duration-200 overflow-hidden">
              {isFolder ? (
                <FolderClosed className="w-10 h-10" />
              ) : (
                <div className=" w-13 h-13 aspect-square">
                  <PlaylistMosaicCover
                    songCovers={songCoversStrings}
                    title={isPlaylist ? item.title : ""}
                    coverImage={item.coverImage}
                    isLikedPlaylist={playlist.id.startsWith("liked-")}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden lg:block flex-1 min-w-0">
            <h3
              className={`${isCurrent ? "text-purple-600 font-bold" : "text-white font-medium"} `}
            >
              {item.title}
            </h3>
            <p className="text-sm text-zinc-400">
              {isFolder
                ? `Folder • ${item.playlistIds.length} playlists`
                : `Playlist • ${item.songs.length} songs`}
            </p>
          </div>

          {isFolder && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="shrink-0 text-zinc-400 hover:text-white transition-colors p-1"
              aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </button>
          )}

          {isCurrentlyPlaying && (
            <span className="ml-3 md:hidden lg:block">
              <EqBars />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}