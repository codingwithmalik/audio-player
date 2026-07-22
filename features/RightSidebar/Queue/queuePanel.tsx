"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectQueueIds,
  selectCurrentIndex,
  selectQueueSourceId,
  setCurrentIndex,
  clearManualQueue,
  shiftManualQueue,
  selectManualQueueIds,
  reorderUpcoming,
} from "@/features/RightSidebar/Queue/queueSlice";
import { selectSongById } from "@/features/Songs/songsSlice";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { setSong } from "@/slices/playerSlice";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import type { RootState } from "@/store/store";
import RecentlyPlayed from "@/features/RightSidebar/Queue/recentlyPlayed";
import SongCover from "@/features/Common/SongCover";
import { selectCurrentSong } from "@/slices/playerSlice";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function QueuePanel() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"queue" | "recentlyPlayed">(
    "queue",
  );

  const queueIds = useAppSelector(selectQueueIds);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const sourceId = useAppSelector(selectQueueSourceId);
  const manualQueueIds = useAppSelector(selectManualQueueIds);
  const contextUpcomingIds = queueIds.slice(currentIndex + 1);

  const playlist = useAppSelector((state: RootState) =>
    sourceId ? selectPlaylistById(state, sourceId) : null,
  );
  const playlistName = playlist?.title ?? "Queue";
  const currentSong = useAppSelector(selectCurrentSong);

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
    if (scrollContainerRef.current) {
      initOS(scrollContainerRef.current);
    }
  }, [initOS]);

  const handleClose = () => dispatch(closeRightSidebarPanel());

  const handleSelectManual = (index: number) => {
    const targetId = manualQueueIds[index];
    if (!targetId) return;
    // Drop everything in the manual queue up to and including the
    // clicked song — they've effectively been "passed."
    for (let i = 0; i <= index; i++) {
      dispatch(shiftManualQueue());
    }
    dispatch(setSong(targetId));
  };

  const handleSelectContext = (offsetFromCurrent: number) => {
    const targetIndex = currentIndex + 1 + offsetFromCurrent;
    const targetId = queueIds[targetIndex];
    if (!targetId) return;
    dispatch(setCurrentIndex(targetIndex));
    dispatch(setSong(targetId));
  };

  // Combined list matches selectUpcomingIds exactly — manual first, then
  // context upcoming. Row ids are position-based (songId::index), since the
  // same song can legitimately appear more than once in the queue.
  const combinedIds = [...manualQueueIds, ...contextUpcomingIds];
  const rowIds = combinedIds.map((id, i) => `${id}::${i}`);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = rowIds.indexOf(active.id as string);
    const toIndex = rowIds.indexOf(over.id as string);
    if (fromIndex === -1 || toIndex === -1) return;

    dispatch(reorderUpcoming({ fromIndex, toIndex }));
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header — tabs + close */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 pt-4 pb-0">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab("queue")}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              activeTab === "queue"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Queue
            {activeTab === "queue" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-purple-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("recentlyPlayed")}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              activeTab === "recentlyPlayed"
                ? "text-white"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Recently played
            {activeTab === "recentlyPlayed" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-purple-500" />
            )}
          </button>
        </div>
        <button
          onClick={handleClose}
          aria-label="Close"
          className="mb-3 flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1"
        data-overlayscrollbars-initialize
      >
        <div className={activeTab === "recentlyPlayed" ? "" : "hidden"}>
          <RecentlyPlayed />
        </div>
        <div className={`px-4 py-4 ${activeTab === "queue" ? "" : "hidden"}`}>
          {currentSong && (
            <section className="mb-6">
              <h3 className="mb-3 text-sm font-bold text-white">Now playing</h3>
              <div className="flex items-center gap-3 rounded-lg p-2">
                <SongCover
                  src={currentSong.coverImage}
                  alt={currentSong.title}
                  size={44}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-purple-500">
                    {currentSong.title}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {currentSong.artists.join(", ")}
                  </p>
                </div>
              </div>
            </section>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {manualQueueIds.length > 0 && (
                <section className="mb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Next in queue
                    </h3>
                    <button
                      onClick={() => dispatch(clearManualQueue())}
                      className="shrink-0 text-xs font-medium text-white/50 hover:text-white transition-colors"
                    >
                      Clear queue
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {manualQueueIds.map((id, i) => (
                      <SortableQueueRow
                        key={rowIds[i]}
                        rowId={rowIds[i]}
                        songId={id}
                        onClick={() => handleSelectManual(i)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {contextUpcomingIds.length > 0 && (
                <section>
                  <h3 className="mb-2 truncate text-sm font-bold text-white">
                    Next from: {playlistName}
                  </h3>
                  <div className="flex flex-col">
                    {contextUpcomingIds.map((id, i) => {
                      const globalIndex = manualQueueIds.length + i;
                      return (
                        <SortableQueueRow
                          key={rowIds[globalIndex]}
                          rowId={rowIds[globalIndex]}
                          songId={id}
                          onClick={() => handleSelectContext(i)}
                        />
                      );
                    })}
                  </div>
                </section>
              )}
            </SortableContext>
          </DndContext>

          {!currentSong &&
            manualQueueIds.length === 0 &&
            contextUpcomingIds.length === 0 && (
              <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
                Queue is empty
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
function SortableQueueRow({
  rowId,
  songId,
  onClick,
}: {
  rowId: string;
  songId: string;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none transition-colors hover:bg-white/5 rounded-md"
    >
      <QueueRow songId={songId} onClick={onClick} />
    </div>
  );
}

function QueueRow({
  songId,
  onClick,
}: {
  songId: string;
  onClick: () => void;
}) {
  const song = useAppSelector((state: RootState) =>
    selectSongById(state, songId),
  );
  if (!song) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-2 text-left "
    >
      <SongCover src={song.coverImage} alt={song.title} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{song.title}</p>
        <p className="truncate text-xs text-white/50">
          {song.artists.join(", ")}
        </p>
      </div>
    </button>
  );
}
