"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Bookmark,
  BookmarkCheck,
  Minimize2,
  Maximize2,
  Music2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Song = {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  duration: number; // seconds
  sourceType?: "playlist" | "folder" | null;
  sourceSlug?: string; // e.g. "/playlists/chill-vibes"
};

type PlayerProps = {
  song?: Song | null;
  isSaved?: boolean;
  onSaveToggle?: (id: string, saved: boolean) => void;
  onQueueOpen?: () => void;
  onMiniPlayer?: () => void;
  onFullscreen?: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Player({
  song,
  isSaved: savedProp = false,
  onSaveToggle,
  onQueueOpen,
  onMiniPlayer,
  onFullscreen,
}: PlayerProps) {
  // ── Demo song fallback (remove when wiring to Redux) ──────────────────────
  const currentSong: Song = song ?? {
    id: "1",
    title: "love lost",
    artist: "Umair, Talha Anjum",
    duration: 181,
    sourceType: "playlist",
    sourceSlug: "/playlists/chill-vibes",
  };

  // ── Local state ───────────────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(79);
  const [volume, setVolume] = useState(80);
  const [prevVolume, setPrevVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isSaved, setIsSaved] = useState(savedProp);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // ── Refs ──────────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const playBtnRef = useRef<HTMLButtonElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const volumeTrackRef = useRef<HTMLDivElement>(null);
  const saveIconRef = useRef<HTMLButtonElement>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Mount animation ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power4.out", delay: 0.1 },
    );
  }, []);

  // ── Playback ticker ───────────────────────────────────────────────────────
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (!isPlaying) return;

    tickRef.current = setInterval(() => {
      setCurrentTime((t) => {
        if (t >= currentSong.duration) {
          setIsPlaying(false);
          return 0;
        }
        return t + 1;
      });
    }, 1000);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isPlaying, currentSong.duration]);

  // ── Play / pause ──────────────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (!playBtnRef.current) return;
    gsap
      .timeline()
      .to(playBtnRef.current, {
        scale: 0.86,
        duration: 0.08,
        ease: "power2.in",
      })
      .to(playBtnRef.current, {
        scale: 1,
        duration: 0.25,
        ease: "elastic.out(1.4,0.5)",
      });
    setIsPlaying((p) => !p);
  };

  // ── Progress bar interaction ───────────────────────────────────────────────
  const seekTo = useCallback(
    (clientX: number) => {
      if (!progressTrackRef.current) return;
      const rect = progressTrackRef.current.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      setCurrentTime(Math.floor(ratio * currentSong.duration));
    },
    [currentSong.duration],
  );

  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsDraggingProgress(true);
    seekTo(e.clientX);
  };

  useEffect(() => {
    if (!isDraggingProgress) return;
    const onMove = (e: MouseEvent) => seekTo(e.clientX);
    const onUp = () => setIsDraggingProgress(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingProgress, seekTo]);

  // ── Volume bar interaction ─────────────────────────────────────────────────
  const setVolFrom = useCallback((clientX: number) => {
    if (!volumeTrackRef.current) return;
    const rect = volumeTrackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const v = Math.round(ratio * 100);
    setVolume(v);
    setIsMuted(v === 0);
  }, []);

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    setIsDraggingVolume(true);
    setVolFrom(e.clientX);
  };

  useEffect(() => {
    if (!isDraggingVolume) return;
    const onMove = (e: MouseEvent) => setVolFrom(e.clientX);
    const onUp = () => setIsDraggingVolume(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDraggingVolume, setVolFrom]);

  // ── Volume mute toggle ────────────────────────────────────────────────────
  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 60);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  // ── Save toggle ───────────────────────────────────────────────────────────
  const handleSaveToggle = () => {
    const next = !isSaved;
    setIsSaved(next);
    onSaveToggle?.(currentSong.id, next);

    if (!saveIconRef.current) return;
    if (next) {
      gsap
        .timeline()
        .to(saveIconRef.current, {
          scale: 1.35,
          duration: 0.15,
          ease: "power2.out",
        })
        .to(saveIconRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1.5,0.5)",
        });
    } else {
      gsap.to(saveIconRef.current, {
        scale: 0.85,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  // ── Repeat cycle ─────────────────────────────────────────────────────────
  const handleRepeat = () =>
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));

  // ── Derived ───────────────────────────────────────────────────────────────
  const progress = (currentTime / currentSong.duration) * 100;
  const effectiveVol = isMuted ? 0 : volume;
  const VolumeIcon =
    effectiveVol === 0 ? VolumeX : effectiveVol < 50 ? Volume1 : Volume2;
  const songHref = currentSong.sourceSlug ?? `/songs/${currentSong.id}`;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="
        fixed bottom-0 left-0 right-0 z-50
        border-t border-white/[0.07]
        bg-black/50 backdrop-blur-3xl
      "
      style={{ WebkitBackdropFilter: "blur(48px)" }}
    >
      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-2 px-3 sm:px-5">
        {/* ══════════════════════════════════════
            LEFT — Song Info
        ══════════════════════════════════════ */}
        <div
          className="flex min-w-0 items-center gap-3"
          style={{ width: 280, flexShrink: 0 }}
        >
          {/* Cover art */}
          <div
            className="
              relative h-12 w-12 shrink-0 overflow-hidden rounded-xl
              border border-white/10 bg-white/5
              shadow-[0_4px_16px_rgba(0,0,0,0.5)]
            "
          >
            {currentSong.coverImage ? (
              <Image
                src={currentSong.coverImage}
                alt={currentSong.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music2 className="h-5 w-5 text-white/30" />
              </div>
            )}

            {/* Playing indicator overlay */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-end justify-center gap-[2px] bg-black/40 pb-1.5">
                {[1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-green-400"
                    style={{
                      animation: `eq-bar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                      height: `${6 + i * 3}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title + Artist */}
          <div className="min-w-0 flex-1">
            <Link
              href={songHref}
              className="
                block truncate text-sm font-semibold text-white
                transition-colors hover:text-white/70
              "
            >
              {currentSong.title}
            </Link>
            <p className="truncate text-xs text-neutral-500">
              {currentSong.artist}
            </p>
          </div>

          {/* Save / playlist button */}
          <button
            ref={saveIconRef}
            onClick={handleSaveToggle}
            aria-label={isSaved ? "Remove from playlist" : "Save to playlist"}
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center rounded-full
              transition-colors duration-200
              ${
                isSaved
                  ? "text-green-400 hover:text-green-300"
                  : "text-neutral-600 hover:text-neutral-300"
              }
            `}
          >
            {isSaved ? (
              <BookmarkCheck className="h-[18px] w-[18px]" />
            ) : (
              <Bookmark className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>

        {/* ══════════════════════════════════════
            CENTER — Player Controls + Timeline
        ══════════════════════════════════════ */}
        <div
          className="flex flex-1 flex-col items-center gap-2"
          style={{ maxWidth: 560 }}
        >
          {/* Control buttons */}
          <div className="flex items-center gap-5">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffle((s) => !s)}
              aria-label="Shuffle"
              className={`
                group relative flex h-8 w-8 items-center justify-center rounded-full
                transition-all duration-200 hover:scale-110
                ${isShuffle ? "text-green-400" : "text-neutral-500 hover:text-neutral-200"}
              `}
            >
              <Shuffle className="h-4 w-4" />
              {isShuffle && (
                <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-green-400" />
              )}
            </button>

            {/* Previous */}
            <button
              aria-label="Previous"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95"
            >
              <SkipBack className="h-[18px] w-[18px] fill-current" />
            </button>

            {/* Play / Pause */}
            <button
              ref={playBtnRef}
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="
                flex h-9 w-9 items-center justify-center rounded-full
                bg-white text-black shadow-[0_0_16px_rgba(255,255,255,0.2)]
                transition hover:bg-neutral-100 active:scale-95
              "
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="h-4 w-4 translate-x-0.5 fill-current" />
              )}
            </button>

            {/* Next */}
            <button
              aria-label="Next"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-300 transition hover:scale-110 hover:text-white active:scale-95"
            >
              <SkipForward className="h-[18px] w-[18px] fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={handleRepeat}
              aria-label="Repeat"
              className={`
                group relative flex h-8 w-8 items-center justify-center rounded-full
                transition-all duration-200 hover:scale-110
                ${repeatMode !== "off" ? "text-green-400" : "text-neutral-500 hover:text-neutral-200"}
              `}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="h-4 w-4" />
              ) : (
                <Repeat className="h-4 w-4" />
              )}
              {repeatMode !== "off" && (
                <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-green-400" />
              )}
            </button>
          </div>

          {/* Progress timeline */}
          <div className="flex w-full items-center gap-2.5">
            <span className="w-8 text-right text-[10px] tabular-nums text-neutral-600 select-none">
              {fmt(currentTime)}
            </span>

            {/* Track */}
            <div
              ref={progressTrackRef}
              onMouseDown={handleProgressMouseDown}
              className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/10"
              style={{ touchAction: "none" }}
            >
              {/* Filled portion */}
              <div
                className="pointer-events-none absolute left-0 top-0 h-full rounded-full transition-colors duration-150"
                style={{
                  width: `${progress}%`,
                  background: isDraggingProgress ? "#4ade80" : "white",
                }}
              />
              {/* Hover green fill via group */}
              <div
                className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-green-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{ width: `${progress}%` }}
              />
              {/* Thumb */}
              <div
                className="
                  pointer-events-none absolute top-1/2 -translate-y-1/2
                  h-3 w-3 rounded-full bg-white shadow-md
                  scale-0 transition-transform duration-150
                  group-hover:scale-100
                "
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>

            <span className="w-8 text-[10px] tabular-nums text-neutral-600 select-none">
              {fmt(currentSong.duration)}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Queue / Volume / Extras
        ══════════════════════════════════════ */}
        <div
          className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2"
          style={{ width: 280 }}
        >
          {/* Queue */}
          <button
            onClick={onQueueOpen}
            aria-label="Open queue"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
          >
            <ListMusic className="h-[17px] w-[17px]" />
          </button>

          {/* Volume icon / mute toggle */}
          <button
            onClick={handleMuteToggle}
            aria-label={isMuted ? "Unmute" : "Mute"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
          >
            <VolumeIcon className="h-[17px] w-[17px]" />
          </button>

          {/* Volume bar */}
          <div
            ref={volumeTrackRef}
            onMouseDown={handleVolumeMouseDown}
            aria-label="Volume"
            className="group relative h-1 w-24 cursor-pointer rounded-full bg-white/10"
            style={{ touchAction: "none" }}
          >
            <div
              className="pointer-events-none absolute left-0 top-0 h-full rounded-full bg-white/60 transition-all duration-75 group-hover:bg-green-400"
              style={{ width: `${effectiveVol}%` }}
            />
            <div
              className="
                pointer-events-none absolute top-1/2 -translate-y-1/2
                h-3 w-3 rounded-full bg-white shadow
                scale-0 transition-transform duration-150
                group-hover:scale-100
              "
              style={{ left: `calc(${effectiveVol}% - 6px)` }}
            />
          </div>

          {/* Divider */}
          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Mini player */}
          <button
            onClick={onMiniPlayer}
            aria-label="Mini player"
            title="Mini Player"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
          >
            <Minimize2 className="h-[15px] w-[15px]" />
          </button>

          {/* Full screen / song view */}
          <button
            onClick={onFullscreen}
            aria-label="Full screen view"
            title="Full Screen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:scale-110 hover:text-neutral-200"
          >
            <Maximize2 className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>

      {/* EQ bar keyframes (injected once) */}
      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
