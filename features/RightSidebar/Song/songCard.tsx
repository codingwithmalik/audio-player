/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  Clock,
  Link2,
  Check,
  Music2,
  Mic2,
  MoreHorizontal,
  ListMusic,
  ChevronDown,
} from "lucide-react";
import { useAppSelector } from "@/globalHooks";
import { selectCurrentSong } from "@/store/playerSlice";
import {
  selectQueueIds,
  selectCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { selectSongById } from "@/features/Songs/songsSlice";
import { selectQueueSourceId } from "@/features/RightSidebar/Queue/queueSlice";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import AddToPlaylistMenu from "@/features/Common/AddSongToPlaylists";
import type { RootState } from "@/store/store";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface SongCardProps {
  onOpenQueue?: () => void;
  onClose?: () => void;
}

export default function SongCard({ onOpenQueue, onClose }: SongCardProps) {
  const song = useAppSelector(selectCurrentSong);
  const queueIds = useAppSelector(selectQueueIds);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const sourceId = useAppSelector(selectQueueSourceId);

  // Resolve next song
  const nextSongId = queueIds[currentIndex + 1] ?? null;
  const nextSong = useAppSelector((state: RootState) =>
    nextSongId ? selectSongById(state, nextSongId) : null,
  );

  // Resolve playlist name
  const playlist = useAppSelector((state: RootState) =>
    sourceId ? selectPlaylistById(state, sourceId) : null,
  );
  const playlistName = playlist?.title ?? "Now Playing";

  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [nextImgError, setNextImgError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset image error when song changes

  useEffect(() => {
    setImgError(false);
  }, [song?.id]);
  useEffect(() => {
    setNextImgError(false);
  }, [nextSongId]);

  // ── GSAP entrance ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!song) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        artRef.current,
        { opacity: 0, scale: 0.93 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", delay: 0.1 },
      );
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.25,
          onComplete: () =>
            gsap.set(infoRef.current, { clearProps: "transform" }),
        },
      );
    }, cardRef);
    return () => ctx.revert();
  }, [song]);

  const handleCopy = () => {
    if (!song) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/songs/${song.id}`)
      .catch(() => {});
    setCopied(true);
    gsap.fromTo(
      copyRef.current,
      { scale: 0.95 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" },
    );
    setTimeout(() => setCopied(false), 2200);
  };

  if (!song) {
    return (
      <div className="flex h-full items-center justify-center text-white/20 text-sm">
        No song playing
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="relative h-full w-full flex flex-col overflow-hidden rounded-xl bg-[#1a0a2e]/80 border border-white/[0.07]"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-40 [background:radial-gradient(circle,rgba(139,92,246,.35)_0%,transparent_70%)]" />

      {/* ── Header ── */}
      <div
        className={`sticky top-0 z-40 flex items-center justify-between h-14 px-4 shrink-0 border-b transition-all duration-300 ${
          scrolled
            ? "bg-[#1a0a2e]/95 border-white/10 backdrop-blur-xl"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <ChevronDown size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Playing from
            </p>
            <h2 className="truncate text-sm font-semibold text-white leading-tight">
              {playlistName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onOpenQueue && (
            <button
              onClick={onOpenQueue}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ListMusic size={16} />
            </button>
          )}
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        // ref={scrollRef}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 5)}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Cover art */}
        <div ref={artRef} className="px-5 pt-5">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]">
            {imgError || !song.coverImage ? (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-900/60 to-indigo-900/60">
                <Music2 className="h-20 w-20 text-white/30" />
              </div>
            ) : (
              <Image
                src={song.coverImage}
                alt={song.title}
                fill
                priority
                sizes="300px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div ref={infoRef} className="space-y-4 p-5">
          {/* Title + add to playlist */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight text-white">
                {song.title}
              </h1>
              <p className="mt-1 truncate text-sm text-white/50">
                {song.artists.join(", ")}
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <AddToPlaylistMenu songId={song.id} />
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3">
            <div className="flex items-center gap-2 text-white/40">
              <Clock size={14} />
              <span className="text-[11px] font-semibold uppercase tracking-widest">
                Duration
              </span>
            </div>
            <span className="text-sm text-white/70">
              {formatDuration(song.duration)}
            </span>
          </div>

          {/* Credits */}
          <div className="overflow-hidden rounded-xl border border-white/8 bg-white/4">
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
              <Mic2 size={14} className="text-white/40" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Credits
              </span>
            </div>
            {song.artists.map((artist, i) => (
              <div
                key={artist}
                className={`flex items-center justify-between px-4 py-3 ${
                  i !== song.artists.length - 1
                    ? "border-b border-white/[0.07]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/10 shrink-0">
                    <span className="text-xs font-bold text-white/60">
                      {artist.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-white/80">{artist}</span>
                </div>
                <span className="text-xs text-white/30">Artist</span>
              </div>
            ))}
          </div>

          {/* Copy link */}
          <button
            ref={copyRef}
            onClick={handleCopy}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition-all duration-300 ${
              copied
                ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/8 hover:text-white"
            }`}
          >
            {copied ? <Check size={15} /> : <Link2 size={15} />}
            {copied ? "Link copied!" : "Copy song link"}
          </button>

          {/* ── Next in queue ── */}
          {nextSong && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                    Up Next
                  </p>
                  <h3 className="text-base font-semibold text-white mt-0.5">
                    Next in queue
                  </h3>
                </div>
                {onOpenQueue && (
                  <button
                    onClick={onOpenQueue}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Open queue
                  </button>
                )}
              </div>

              <button
                onClick={onOpenQueue}
                className="group flex w-full items-center gap-3 rounded-xl border border-white/8 bg-white/4 p-3 text-left transition-all duration-200 hover:border-purple-500/30 hover:bg-purple-500/5"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                  {nextImgError || !nextSong.coverImage ? (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-900/60 to-indigo-900/60">
                      <Music2 className="h-6 w-6 text-white/30" />
                    </div>
                  ) : (
                    <Image
                      src={nextSong.coverImage}
                      alt={nextSong.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                      onError={() => setNextImgError(true)}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {nextSong.title}
                  </h4>
                  <p className="mt-0.5 truncate text-xs text-white/50">
                    {nextSong.artists.join(", ")}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/30">
                    <Clock size={11} />
                    {formatDuration(nextSong.duration)}
                  </div>
                </div>
                <ListMusic
                  size={16}
                  className="shrink-0 text-white/20 group-hover:text-purple-400 transition-colors"
                />
              </button>
            </section>
          )}

          {/* Bottom padding */}
          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
