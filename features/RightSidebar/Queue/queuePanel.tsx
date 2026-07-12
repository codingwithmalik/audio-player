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
} from "@/features/RightSidebar/Queue/queueSlice";
import { selectSongById } from "@/features/Songs/songsSlice";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { setSong } from "@/store/playerSlice";
import { closeRightSidebarPanel } from "@/slices/rightSidebarSlice";
import type { RootState } from "@/store/store";
import RecentlyPlayed from "@/features/RightSidebar/Queue/recentlyPlayed";
import SongCover from "@/features/Common/SongCover";

export default function QueuePanel() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"queue" | "recentlyPlayed">(
    "queue",
  );

  const queueIds = useAppSelector(selectQueueIds);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const sourceId = useAppSelector(selectQueueSourceId);

  const playlist = useAppSelector((state: RootState) =>
    sourceId ? selectPlaylistById(state, sourceId) : null,
  );
  const playlistName = playlist?.title ?? "Queue";

  const currentSongId = queueIds[currentIndex] ?? null;
  const currentSong = useAppSelector((state: RootState) =>
    currentSongId ? selectSongById(state, currentSongId) : null,
  );

  const upcomingIds = queueIds.slice(currentIndex + 1);

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

  const handleSelectUpcoming = (offsetFromCurrent: number) => {
    const targetIndex = currentIndex + 1 + offsetFromCurrent;
    const targetId = queueIds[targetIndex];
    if (!targetId) return;
    dispatch(setCurrentIndex(targetIndex));
    dispatch(setSong(targetId));
  };

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

          {upcomingIds.length > 0 && (
            <section>
              <h3 className="mb-2 truncate text-sm font-bold text-white">
                Next from: {playlistName}
              </h3>
              <div className="flex flex-col">
                {upcomingIds.map((id, i) => (
                  <QueueRow
                    key={`${id}-${i}`}
                    songId={id}
                    onClick={() => handleSelectUpcoming(i)}
                  />
                ))}
              </div>
            </section>
          )}

          {!currentSong && upcomingIds.length === 0 && (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
              Queue is empty
            </div>
          )}
        </div>
      </div>
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
      className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/5"
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
