"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import PlaylistSongGridCard from "./playlistSongGridCard";
import { Song } from "@/types/song";
import { PlaylistSong } from "@/types/playlist";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import {
  reorderPlaylistSongs,
  selectSortBy,
  selectSearchQuery,
} from "@/features/Playlist/playlistSlice";

const PlaylistTrackGrid = ({
  playlistId,
  playlistSongs,
  filteredSongs,
  onPlaySong,
  currentSongId,
  isPlaylistPlaying,
  isCurrentPlaylist,
}: {
  playlistId: string;
  playlistSongs: PlaylistSong[];
  filteredSongs: Song[];
  onPlaySong: (songId: string, index: number) => void;
  currentSongId: string | null;
  isPlaylistPlaying: boolean;
  isCurrentPlaylist: boolean;
}) => {
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector(selectSortBy);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isReorderEnabled = sortBy === "custom" && searchQuery.trim() === "";

  // Delay-based, not distance-based: a quick tap/double-click still plays
  // the song; only a genuine press-and-hold starts a drag. Same reasoning
  // as the list's sensor, needed here since the whole tile is draggable
  // (no separate handle for grid tiles).
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = playlistSongs.findIndex((s) => s.songId === active.id);
    const toIndex = playlistSongs.findIndex((s) => s.songId === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    dispatch(reorderPlaylistSongs({ playlistId, fromIndex, toIndex }));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredSongs.map((s) => s.id)}
        strategy={rectSortingStrategy}
      >
        <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredSongs.map((song, i) => (
            <div key={song.id} data-gsap="track-row">
              <PlaylistSongGridCard
                song={song}
                isPlaying={isPlaylistPlaying && song.id === currentSongId}
                isCurrent={isCurrentPlaylist && song.id === currentSongId}
                onPlaySong={() => onPlaySong(song.id, i)}
                isReorderEnabled={isReorderEnabled}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default PlaylistTrackGrid;
