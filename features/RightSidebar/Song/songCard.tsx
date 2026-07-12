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
import BottomSheet from "@/features/Common/BottomSheet";
import SongMoreOptions from "@/features/Playlist/songMoreOptions";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useOverlayScrollbars } from "overlayscrollbars-react";
import PlayerControls from "@/features/Player/playerControls";

gsap.registerPlugin(ScrollTrigger);

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface SongCardProps {
  onOpenQueue?: () => void;
  onClose?: () => void;
  variant?: "sidebar" | "full";
}

export default function SongCard({
  onOpenQueue,
  onClose,
  variant = "sidebar",
}: SongCardProps) {
  const isFull = variant === "full";
  const song = useAppSelector(selectCurrentSong);
  const queueIds = useAppSelector(selectQueueIds);
  const currentIndex = useAppSelector(selectCurrentIndex);
  const sourceId = useAppSelector(selectQueueSourceId);

  const nextSongId = queueIds[currentIndex + 1] ?? null;
  const nextSong = useAppSelector((state: RootState) =>
    nextSongId ? selectSongById(state, nextSongId) : null,
  );

  const playlist = useAppSelector((state: RootState) =>
    sourceId ? selectPlaylistById(state, sourceId) : null,
  );
  const playlistName = playlist?.title ?? "Now Playing";

  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [nextImgError, setNextImgError] = useState(false);
  const [songMoreOptionsOpen, setSongMoreOptionsOpen] = useState(false);

  const isMobile = useIsMobile();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);

  const [initOS, osInstance] = useOverlayScrollbars({
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

  useEffect(() => {
    setImgError(false);
  }, [song?.id]);
  useEffect(() => {
    setNextImgError(false);
  }, [nextSongId]);

  // Header scroll animation — only for sidebar
  useEffect(() => {
    if (isFull) return;
    const os = osInstance();
    if (!os) return;

    const scroller = os.elements().viewport;
    if (!scroller || !headerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: scroller,
      scroller: scroller,
      start: "top+=10 top",
      onEnter: () =>
        gsap.set(headerRef.current, {
          background: "#1a0a2e",
          boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
        }),
      onLeaveBack: () =>
        gsap.set(headerRef.current, {
          background: "transparent",
          boxShadow: "none",
          borderBottomColor: "transparent",
        }),
    });

    return () => trigger.kill();
  }, [osInstance, isFull]);

  // GSAP entrance
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
      className={`relative h-full w-full flex flex-col ${
        isFull
          ? ""
          : "rounded-md bg-[#1a0a2e]/80 border border-white/[0.07]"
      }`}
    >
      {/* Dynamic background blur for full view */}
      {isFull && song.coverImage && !imgError && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={song.coverImage}
            alt=""
            fill
            className="object-cover opacity-20 blur-3xl scale-150"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Background glow (sidebar only) */}
      {!isFull && (
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-40 [background:radial-gradient(circle,rgba(139,92,246,.35)_0%,transparent_70%)]" />
      )}

      {/* ── Header — ONLY for sidebar ── */}
      {/* {(!isFull || (isFull && isMobile)) && ( */}
      <div
        ref={headerRef}
        className="shrink-0 z-40 flex items-center justify-between h-14 px-4 border-b border-transparent transition-all duration-300 rounded-t-md"
      >
        <div className="flex items-center gap-2 min-w-0">
          {isFull && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            >
              <ChevronDown size={18} />
            </button>
          )}
          <div className={`min-w-0 ${isFull ? "flex gap-4 text-2xl justify-center items-center" : ""}`}>
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
          <div className="relative">
            <button
              onClick={() => setSongMoreOptionsOpen((v) => !v)}
              ref={anchorRef}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>

            {isMobile ? (
              <BottomSheet
                isOpen={songMoreOptionsOpen}
                onClose={() => setSongMoreOptionsOpen(false)}
              >
                <SongMoreOptions
                  songId={song.id}
                  playlistId={sourceId}
                  onClose={() => setSongMoreOptionsOpen(false)}
                  variant="sheet"
                  anchorRef={anchorRef}
                />
              </BottomSheet>
            ) : (
              songMoreOptionsOpen && (
                <SongMoreOptions
                  anchorRef={anchorRef}
                  songId={song.id}
                  playlistId={sourceId}
                  onClose={() => setSongMoreOptionsOpen(false)}
                  variant="dropdown"
                />
              )
            )}
          </div>
        </div>
      </div>
      {/* )} */}

      {/* ── Scrollable content ── */}
      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 relative z-10"
        data-overlayscrollbars-initialize
      >
        <div className="w-full">
          {/* Cover art */}
          <div
            ref={artRef}
            className={isFull ? "px-6 pt-6 md:px-12 md:pt-8" : "px-5 pt-5"}
          >
            <div
              className={`relative overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)] ${
                isFull
                  ? "aspect-square w-full max-md:max-w-100 max-w-110 mx-auto rounded-2xl"
                  : "aspect-square w-full rounded-2xl"
              }`}
            >
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
                  sizes={isFull ? "400px" : "300px"}
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
          </div>

          {/* Song Info */}
          {(isMobile || !isFull) && (
            <div
              ref={infoRef}
              className={isFull ? "px-6 pt-4 md:px-12" : "space-y-4 p-5"}
            >
              <div
                className={`flex items-start justify-between gap-3 min-w-0 overflow-hidden ${
                  isFull && isMobile ? "mb-2" : ""
                }`}
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h1
                    className={`font-bold tracking-tight text-white ${
                      isFull ? "text-2xl md:text-3xl" : "text-xl"
                    }`}
                  >
                    {song.title}
                  </h1>
                  <p className="mt-1 text-sm text-white/50">
                    {song.artists.join(", ")}
                  </p>
                </div>
                <div className="shrink-0 mt-1 flex items-center gap-2">
                  {isFull && (
                    <button
                      ref={copyRef}
                      onClick={handleCopy}
                      aria-label="Share"
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 ${
                        copied
                          ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                          : "border-white/10 bg-white/5 text-white/60 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {copied ? <Check size={14} /> : <Link2 size={14} />}
                    </button>
                  )}
                  <AddToPlaylistMenu songId={song.id} />
                </div>
              </div>

              {/* Duration + Copy link — compact row for full, stacked for sidebar */}
              {/* {isFull ? (
              <div className="flex items-center gap-3">
                <button
                  ref={copyRef}
                  onClick={handleCopy}
                  className={`shrink-0 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                    copied
                      ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                      : "border-white/8 bg-white/4 text-white/60 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  {copied ? <Check size={15} /> : <Link2 size={15} />}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>
            ) : (
              <>
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
              </>
            )} */}
            </div>
          )}

          {/* Mobile player controls — only in full view on mobile */}
          {isFull && isMobile && (
            <div className="px-6 py-6">
              <PlayerControls isActive={true} fullLayout={true} />
            </div>
          )}

          {/* Two-column layout for full view, stacked for sidebar */}
          {isFull ? (
            <div className="px-6 pb-6 md:px-12 md:pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Credits */}
                <div className="overflow-hidden rounded-xl border border-white/8 bg-white/4">
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mic2 size={14} className="text-white/40" />
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                        Credits
                      </span>
                    </div>
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
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/10 shrink-0">
                          <span className="text-xs font-bold text-white/60">
                            {artist.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm text-white/80 truncate block">
                            {artist}
                          </span>
                          <span className="text-xs text-white/30">Artist</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Next in queue */}
                {nextSong && (
                  <div className="overflow-hidden rounded-xl border border-white/8 bg-white/4">
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                          Up Next
                        </p>
                        <h3 className="text-sm font-semibold text-white mt-0.5">
                          Next in queue
                        </h3>
                      </div>
                      {onOpenQueue && (
                        <button
                          onClick={onOpenQueue}
                          className="text-xs text-white/50 hover:text-white transition-colors"
                        >
                          Open queue
                        </button>
                      )}
                    </div>

                    <button
                      onClick={onOpenQueue}
                      className="group flex w-full items-center gap-3 p-3 text-left transition-all duration-200 hover:bg-white/5"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        {nextImgError || !nextSong.coverImage ? (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-900/60 to-indigo-900/60">
                            <Music2 className="h-5 w-5 text-white/30" />
                          </div>
                        ) : (
                          <Image
                            src={nextSong.coverImage}
                            alt={nextSong.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            onError={() => setNextImgError(true)}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-white group transition-colors">
                          {nextSong.title}
                        </h4>
                        <p className="mt-0.5 truncate text-xs text-white/50">
                          {nextSong.artists.join(", ")}
                        </p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="px-5 pb-5 space-y-4">
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
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/10 shrink-0">
                        <span className="text-xs font-bold text-white/60">
                          {artist.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-white/80 truncate">
                        {artist}
                      </span>
                    </div>
                    <span className="text-xs text-white/30 shrink-0">
                      Artist
                    </span>
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

              {/* Next in queue */}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
