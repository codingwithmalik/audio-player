"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ListMusic,
  Volume2,
  Volume1,
  VolumeX,
  Minimize2,
  Maximize2,
} from "lucide-react";

import { useVolumeDrag } from "@/hooks/UseSliderDrag";
import {
  toggleMute,
  selectEffectiveVol,
  selectIsDraggingVolume,
  selectIsNowPlayingOpen,
  closeNowPlaying,
} from "@/store/playerSlice";
import {
  closeRightSidebarPanel,
  openQueue,
  selectIsQueueOpen,
} from "@/slices/rightSidebarSlice";

type PlayerExtrasProps = {
  onMinimize?: () => void;
  onFullscreen?: () => void;
  isActive: boolean;
};

export default function PlayerExtras({
  isActive,
  onMinimize,
  onFullscreen,
}: PlayerExtrasProps) {
  const dispatch = useDispatch();
  const effectiveVol = useSelector(selectEffectiveVol);
  const isDragging = useSelector(selectIsDraggingVolume);
  const isOpen = useSelector(selectIsNowPlayingOpen);
  const queueOpen = useSelector(selectIsQueueOpen);

  const volumeTrackRef = useRef<HTMLDivElement>(null!);

  // ── Volume drag — one hook call replaces ~25 lines ────────────────────────
  const volumeHandlers = useVolumeDrag(volumeTrackRef, isDragging);

  const VolumeIcon =
    effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;

  const handleOpenQueue = () => {
    if (queueOpen) {
      dispatch(closeRightSidebarPanel());
    } else {
      dispatch(openQueue());
      dispatch(closeNowPlaying());
    }
  };
  return (
    <div
      className={`hidden shrink-0 items-center justify-end gap-1 md:flex lg:gap-1.5 ${isActive ? "" : "pointer-events-none opacity-40"}`}
      style={{ width: "clamp(200px, 22%, 280px)" }}
    >
      {/* Queue */}
      <button
        onClick={handleOpenQueue}
        aria-label="Open queue"
        title="Queue"
        className={`relative flex h-8 w-8 items-center justify-center rounded-full  transition hover:scale-110 ${queueOpen ? "text-purple-600" : "text-neutral-500 hover:text-neutral-200"}`}
      >
        <ListMusic className="h-4 w-4 lg:h-4.25 lg:w-4.25" />
        {queueOpen && (
          <span className="absolute left-1/2 h-0.75 w-0.75 bottom-0 -translate-x-1/2 rounded-full bg-purple-600" />
        )}
      </button>

      {/* Mute */}
      <button
        onClick={() => dispatch(toggleMute())}
        aria-label={effectiveVol === 0 ? "Unmute" : "Mute"}
        title={effectiveVol === 0 ? "Unmute" : "Mute"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
      >
        <VolumeIcon className="h-4 w-4 lg:h-4.25 lg:w-4.25" />
      </button>

      {/* Volume slider */}
      <div
        ref={volumeTrackRef}
        {...volumeHandlers}
        onPointerCancel={volumeHandlers.onPointerUp}
        role="slider"
        aria-label="Volume"
        aria-valuenow={effectiveVol}
        aria-valuemin={0}
        aria-valuemax={100}
        className="group relative h-1 w-16 cursor-pointer rounded-full bg-white/10 lg:w-24"
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <div
          className={`pointer-events-none absolute left-0 top-0 h-full rounded-full transition-all duration-75 ${
            isDragging
              ? "bg-purple-600"
              : "bg-white/60 group-hover:bg-purple-600"
          }`}
          style={{ width: `${effectiveVol}%` }}
        />
        <div
          className={`pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-150 ${
            isDragging ? "scale-100" : "scale-0 group-hover:scale-100"
          }`}
          style={{ left: `calc(${effectiveVol}% - 6px)` }}
        />
      </div>

      <div className="mx-0.5 h-4 w-px bg-white/10 lg:mx-1" />

      {isOpen ? (
        <button
          onClick={onMinimize}
          aria-label="Minimize"
          title="Minimize"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
        >
          <Minimize2 className="h-3.5 w-3.5 lg:h-3.75 lg:w-3.75" />
        </button>
      ) : (
        <button
          onClick={onFullscreen}
          aria-label="Full screen view"
          title="Full Screen"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
        >
          <Maximize2 className="h-3.5 w-3.5 lg:h-3.75 lg:w-3.75" />
        </button>
      )}
    </div>
  );
}
