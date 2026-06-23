"use client";

import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListMusic, Volume2, Volume1, VolumeX, Minimize2, Maximize2 } from "lucide-react";

import { useVolumeDrag } from "@/hooks/UseSliderDrag";
import {
  toggleMute,
  selectEffectiveVol, selectIsDraggingVolume,
} from "@/store/playerSlice";

type PlayerExtrasProps = {
  onQueueOpen?:  () => void;
  onMiniPlayer?: () => void;
  onFullscreen?: () => void;
  isActive:boolean
};

export default function PlayerExtras({isActive, onQueueOpen, onMiniPlayer, onFullscreen }: PlayerExtrasProps) {
  const dispatch     = useDispatch();
  const effectiveVol = useSelector(selectEffectiveVol);
  const isDragging   = useSelector(selectIsDraggingVolume);

  const volumeTrackRef = useRef<HTMLDivElement>(null!);

  // ── Volume drag — one hook call replaces ~25 lines ────────────────────────
  const volumeHandlers = useVolumeDrag(volumeTrackRef, isDragging);

  const VolumeIcon =
    effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;

  return (
    <div
      className={`hidden shrink-0 items-center justify-end gap-1 md:flex lg:gap-1.5 ${isActive ?"":"pointer-events-none opacity-40"}`}
      style={{ width: "clamp(200px, 22%, 280px)" }}
    >
      {/* Queue */}
      <button
        onClick={onQueueOpen}
        aria-label="Open queue"
        title="Queue"
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
      >
        <ListMusic className="h-[16px] w-[16px] lg:h-[17px] lg:w-[17px]" />
      </button>

      {/* Mute */}
      <button
        onClick={() => dispatch(toggleMute())}
        aria-label={effectiveVol === 0 ? "Unmute" : "Mute"}
        title={effectiveVol === 0 ? "Unmute" : "Mute"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
      >
        <VolumeIcon className="h-[16px] w-[16px] lg:h-[17px] lg:w-[17px]" />
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
            isDragging ? "bg-purple-600" : "bg-white/60 group-hover:bg-purple-600"
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

      {/* Mini player */}
      <button
        onClick={onMiniPlayer}
        aria-label="Mini player"
        title="Mini Player"
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
      >
        <Minimize2 className="h-[14px] w-[14px] lg:h-[15px] lg:w-[15px]" />
      </button>

      {/* Full screen */}
      <button
        onClick={onFullscreen}
        aria-label="Full screen view"
        title="Full Screen"
        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
      >
        <Maximize2 className="h-[14px] w-[14px] lg:h-[15px] lg:w-[15px]" />
      </button>
    </div>
  );
}