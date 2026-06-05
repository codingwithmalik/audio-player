"use client";

import { useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import {
  Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Repeat1,
} from "lucide-react";

import { useProgressDrag } from "@/hooks/UseSliderDrag";
import {
  togglePlay, toggleShuffle, cycleRepeat, 
  selectSong, selectIsPlaying, selectCurrentTime,
  selectIsShuffle, selectRepeatMode, selectProgress, selectIsDraggingProgress,
} from "@/store/playerSlice";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (s: number) => {
  const m   = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ─── PlayerControls ───────────────────────────────────────────────────────────

export default function PlayerControls() {
  const dispatch    = useDispatch();
  const song        = useSelector(selectSong);
  const isPlaying   = useSelector(selectIsPlaying);
  const currentTime = useSelector(selectCurrentTime);
  const isShuffle   = useSelector(selectIsShuffle);
  const repeatMode  = useSelector(selectRepeatMode);
  const progress    = useSelector(selectProgress);
  const isDragging  = useSelector(selectIsDraggingProgress);

  const playBtnRef       = useRef<HTMLButtonElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null!);

  // ── Play / pause ──────────────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (playBtnRef.current) {
      gsap.timeline()
        .to(playBtnRef.current, { scale: 0.86, duration: 0.08, ease: "power2.in" })
        .to(playBtnRef.current, { scale: 1,    duration: 0.25, ease: "elastic.out(1.4,0.5)" });
    }
    dispatch(togglePlay());
  };

  // ── Progress drag — one hook call replaces ~25 lines ──────────────────────
  const progressHandlers = useProgressDrag(
    progressTrackRef,
    song?.duration ?? 0,
    isDragging,
  );

  if (!song) return null;

  return (
    <>
      {/* MOBILE: transport only (timeline lives in Player.tsx) */}
      <div className="flex items-center justify-center gap-6 md:hidden">
        <button aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95">
          <SkipBack className="h-[18px] w-[18px] fill-current" />
        </button>

        <button
          ref={playBtnRef}
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)] transition hover:bg-neutral-100 active:scale-95"
        >
          {isPlaying
            ? <Pause className="h-4 w-4 fill-current" />
            : <Play  className="h-4 w-4 translate-x-0.5 fill-current" />}
        </button>

        <button aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95">
          <SkipForward className="h-[18px] w-[18px] fill-current" />
        </button>
      </div>

      {/* DESKTOP: full controls + timeline */}
      <div className="hidden flex-1 flex-col items-center gap-1.5 md:flex lg:gap-2" style={{ maxWidth: 560 }}>
        {/* Transport row */}
        <div className="flex items-center gap-4 lg:gap-5">
          <button
            onClick={() => dispatch(toggleShuffle())}
            aria-label="Shuffle"
            className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${isShuffle ? "text-purple-500" : "text-neutral-500 hover:text-neutral-200"}`}
          >
            <Shuffle className="h-[15px] w-[15px] lg:h-4 lg:w-4" />
            {isShuffle && <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-purple-500" />}
          </button>

          <button aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95">
            <SkipBack className="h-[16px] w-[16px] fill-current lg:h-[18px] lg:w-[18px]" />
          </button>

          <button
            ref={playBtnRef}
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)] transition hover:bg-neutral-100 active:scale-95 lg:h-9 lg:w-9"
          >
            {isPlaying
              ? <Pause className="h-3.5 w-3.5 fill-current lg:h-4 lg:w-4" />
              : <Play  className="h-3.5 w-3.5 translate-x-0.5 fill-current lg:h-4 lg:w-4" />}
          </button>

          <button aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95">
            <SkipForward className="h-[16px] w-[16px] fill-current lg:h-[18px] lg:w-[18px]" />
          </button>

          <button
            onClick={() => dispatch(cycleRepeat())}
            aria-label="Repeat"
            className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${repeatMode !== "off" ? "text-purple-500" : "text-neutral-500 hover:text-neutral-200"}`}
          >
            {repeatMode === "one"
              ? <Repeat1 className="h-[15px] w-[15px] lg:h-4 lg:w-4" />
              : <Repeat  className="h-[15px] w-[15px] lg:h-4 lg:w-4" />}
            {repeatMode !== "off" && <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-purple-400" />}
          </button>
        </div>

        {/* Timeline */}
        <ProgressBar
          progressTrackRef={progressTrackRef}
          {...progressHandlers}
          progress={progress}
          isDragging={isDragging}
          currentTime={currentTime}
          duration={song.duration}
        />
      </div>
    </>
  );
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────
// Exported for reuse in Player.tsx (mobile full-width row).

export type ProgressBarProps = {
  progressTrackRef: React.RefObject<HTMLDivElement | null>;
  onPointerDown:    (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove:    (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp:      (e: React.PointerEvent<HTMLDivElement>) => void;
  progress:         number;
  isDragging:       boolean;
  currentTime:      number;
  duration:         number;
  compact?:         boolean;
};

export function ProgressBar({
  progressTrackRef,
  onPointerDown, onPointerMove, onPointerUp,
  progress, isDragging, currentTime, duration,
  compact = false,
}: ProgressBarProps) {
  return (
    <div className={`flex w-full items-center ${compact ? "gap-2" : "gap-2 lg:gap-2.5"}`}>
      <span className="w-7 text-right text-[10px] tabular-nums text-neutral-600 select-none">
        {fmt(currentTime)}
      </span>

      <div
        ref={progressTrackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/10"
        style={{ touchAction: "none", userSelect: "none" }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full transition-colors duration-100"
          style={{ width: `${progress}%`, background: isDragging ? "#4ade80" : "white" }}
        />
        <div
          className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-purple-600 opacity-0 transition-opacity duration-100 group-hover:opacity-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className={`pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform duration-100 ${
            isDragging ? "scale-100" : compact ? "scale-0" : "scale-0 group-hover:scale-100"
          }`}
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      <span className="w-7 text-[10px] tabular-nums text-neutral-600 select-none">
        {fmt(duration)}
      </span>
    </div>
  );
}