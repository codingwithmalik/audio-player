"use client";

import { Clock } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlaylistTrackRow from "./playlistTrackRow";
import { Song } from "@/types/song";
import { PlaylistSong } from "@/types/playlist";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { reorderPlaylistSongs, selectSortBy, selectSearchQuery } from "@/features/Playlist/playlistSlice";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PlaylistTrackListProps {
  playlistId: string;
  songs: Song[];
  playlistSongs: PlaylistSong[];
  currentSongId: string | null;
  onPlaySong: (songId: string, index: number) => void;
  isPlaylistPlaying: boolean;
  isCurrentPlaylist: boolean;
}

export default function PlaylistTrackList({
  playlistId,
  songs,
  playlistSongs,
  currentSongId,
  isPlaylistPlaying,
  onPlaySong,
  isCurrentPlaylist,
}: PlaylistTrackListProps) {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const searchQuery = useAppSelector(selectSearchQuery);

  // Reordering only makes sense when the visible order matches the real
  // playlist order — i.e. no search filter, and not sorted by title/artist/etc.
  const isReorderEnabled = sortBy === "custom" && searchQuery.trim() === "";

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: {delay:100, tolerance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = playlistSongs.findIndex((s) => s.songId === active.id);
    const toIndex = playlistSongs.findIndex((s) => s.songId === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    dispatch(reorderPlaylistSongs({ playlistId, fromIndex, toIndex }));
  }

  if (songs.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-white/40 text-sm">
        No songs in this playlist yet.
      </div>
    );
  }

  return (
    <div role="table" aria-label="Playlist tracks" className="w-full px-2">
      {/* Column header */}
      <div
        role="row"
        className="hidden sm:grid items-center gap-4 px-4 pb-2 mb-1 border-b border-white/10 sm:grid-cols-[20px_32px_1.5fr_20px_1fr_48px_32px]"
      >
        <span /> {/* drag handle spacer, keeps header aligned with rows */}
        <span className="text-xs text-white/40 text-center font-semibold">#</span>
        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Title</span>
        <span></span>
        <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Date added</span>
        <span className="flex justify-end">
          <Clock className="w-4 h-4 text-white/40" />
        </span>
        <span />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={songs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div role="rowgroup" className="flex flex-col gap-0.5 mt-1">
            {songs.map((song, i) => (
              <SortableTrackRow
                key={song.id}
                song={song}
                index={i + 1}
                addedAt={playlistSongs[i]?.addedAt ?? song.createdAt}
                isPlaying={isPlaylistPlaying && song.id === currentSongId}
                isCurrent={isCurrentPlaylist && song.id === currentSongId}
                onPlay={() => onPlaySong(song.id, i)}
                isReorderEnabled={isReorderEnabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Wraps PlaylistTrackRow with useSortable — kept local to this file since
// it's only ever used here, same reasoning as the inline vertical-drag math
// in PlaybackSection.
function SortableTrackRow({
  song,
  index,
  addedAt,
  isPlaying,
  isCurrent,
  onPlay,
  isReorderEnabled,
}: {
  song: Song;
  index: number;
  addedAt: string;
  isPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
  isReorderEnabled: boolean;
}) {
    const isMobile = useIsMobile();
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.id,
    disabled: !isReorderEnabled|| isMobile,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}  {...(isReorderEnabled ? { ...attributes, ...listeners } : {})} className="touch-none" data-gsap="track-row">
      <PlaylistTrackRow
        song={song}
        index={index}
        addedAt={addedAt}
        isPlaying={isPlaying}
        isCurrent={isCurrent}
        onPlay={onPlay}
      />
    </div>
  );
}