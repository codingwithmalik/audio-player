"use client";

import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { gsap } from "gsap";

import SongInfo, { MobileSaveButton } from "./songInfo";
import PlayerControls, { ProgressBar } from "./playerControls";
import PlayerExtras from "./playerExtras";
import { useProgressDrag } from "@/hooks/UseSliderDrag";
import {
  selectSong, selectCurrentTime, selectProgress, selectIsDraggingProgress,
} from "@/store/playerSlice";
import usePlaybackTicker from "./UseplaybackTicker";

type PlayerShellProps = {
  onQueueOpen?:  () => void;
  onMiniPlayer?: () => void;
  onFullscreen?: () => void;
};

export default function Player({ onQueueOpen, onMiniPlayer, onFullscreen }: PlayerShellProps) {
  const song        = useSelector(selectSong);
  const currentTime = useSelector(selectCurrentTime);
  const progress    = useSelector(selectProgress);
  const isDragging  = useSelector(selectIsDraggingProgress);

  const containerRef   = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null!);

    // ── Ticker: single interval, lives here at the root, never duplicated ─────
  usePlaybackTicker();

  // ── Mount animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power4.out", delay: 0.1 },
    );
  }, []);

  // ── Mobile progress bar — same hook, zero duplicated logic ─────────────────
  const mobileProgressHandlers = useProgressDrag(
    mobileTrackRef,
    song?.duration ?? 0,
    isDragging,
  );

  if (!song) return null;

  return (
    <div
      ref={containerRef}
      className="relative z-50 border-t border-white/[0.07] bg-black/50 backdrop-blur-3xl"
      style={{ WebkitBackdropFilter: "blur(48px)" }}
    >
      {/* Top glow line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

      {/* ── MOBILE ── */}
      <div className="flex flex-col gap-2 px-3 py-2.5 md:hidden">
        <div className="flex items-center justify-around gap-2.5">
          <SongInfo />
          <PlayerControls />
          <MobileSaveButton />
        </div>

        <ProgressBar
          progressTrackRef={mobileTrackRef}
          {...mobileProgressHandlers}
          progress={progress}
          isDragging={isDragging}
          currentTime={currentTime}
          duration={song.duration}
          compact
        />
      </div>

      {/* ── DESKTOP ── */}
      <div className="mx-auto hidden h-[82px] max-w-[1600px] items-center justify-between gap-2 px-4 md:flex lg:h-[90px] lg:px-5">
        <SongInfo />
        <PlayerControls />
        <PlayerExtras
          onQueueOpen={onQueueOpen}
          onMiniPlayer={onMiniPlayer}
          onFullscreen={onFullscreen}
        />
      </div>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}