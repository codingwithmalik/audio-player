"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

import {
  Heart,
  Calendar,
  Clock,
  Music,
  Link2,
  Check,
  Music2,
  Mic2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TYPE
// ─────────────────────────────────────────────────────────────────

interface Song {
  title: string;
  artists: string[]; // e.g. ["The Weeknd"] or ["Dua Lipa", "DaBaby"]
  coverImage?: string; // image URL
  dateAdded: string; // ISO date e.g. "2025-05-14"
  duration: number; // in seconds e.g. 200
  songUrl: string; // link that gets copied
  isSaved: boolean; // whether song is in playlist
}

interface SongCardProps {
  song: Song;
  onSaveToggle?: (saved: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

// 200  →  "3:20"
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// "2025-05-14"  →  "May 14, 2025"
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function SongCard({ song, onSaveToggle }: SongCardProps) {
  // ── State ──────────────────────────────────────────────────────
  const [saved, setSaved] = useState(song.isSaved);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  // console.log(imgError);

  // ── Refs (for GSAP targets) ────────────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const copyRef = useRef<HTMLButtonElement>(null);

  // ── Entrance animation (runs once on mount) ────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // card fades + slides up
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" },
      );
      // cover art scales in slightly after
      gsap.fromTo(
        artRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.15,
        },
      );
      // info section fades in last
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.3 },
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // ── Save / heart handler ───────────────────────────────────────
  function handleSave() {
    const next = !saved;
    setSaved(next);
    onSaveToggle?.(next);

    // spring bounce on the heart button
    gsap
      .timeline()
      .to(heartRef.current, { scale: 0.75, duration: 0.1, ease: "power2.in" })
      .to(heartRef.current, {
        scale: 1.25,
        duration: 0.18,
        ease: "back.out(3)",
      })
      .to(heartRef.current, { scale: 1, duration: 0.12, ease: "power2.out" });
  }

  // ── Copy link handler ──────────────────────────────────────────
  function handleCopy() {
    navigator.clipboard.writeText(song.songUrl).catch(() => {});
    setCopied(true);

    gsap.fromTo(
      copyRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.25, ease: "back.out(2)" },
    );

    setTimeout(() => setCopied(false), 2200);
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
      <div
        ref={cardRef}
        className="w-full rounded-lg h-full
        bg-white/6
        shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.09)]
        overflow-y-auto scrollbar-none
        "
      >
        {/* ── Purple glow orb (decorative, sits behind everything) ── */}
        <div
          className="
        pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
        w-52 h-52 rounded-full opacity-60
        [background:radial-gradient(circle,rgba(168,85,247,0.35)_0%,transparent_70%)]
      "
        />

        {/* ── Cover art ─────────────────────────────────────────── */}
        <div ref={artRef} className="relative z-10 p-4 pb-0">
          <div
            className="
          relative aspect-square w-full overflow-hidden rounded-2xl
          shadow-[0_16px_48px_rgba(0,0,0,0.55)]
        "
          >
            {imgError ? (
              // fallback emoji if image fails to load
              <div
                className="
              w-full h-full flex items-center justify-center text-6xl
              [background:linear-gradient(135deg,rgba(168,85,247,0.35),rgba(34,211,238,0.25))]
            "
              >
                <Music2 className="w-[2em] h-[2em]" />
              </div>
            ) : (
              <Image
                src={song.coverImage || "/placeholder.png"}
                alt={song.title}
                fill
                sizes="300px"
                priority
                className="object-cover"
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>

        {/* ── Info section ──────────────────────────────────────── */}
        {/* ── Info section ──────────────────────────────────────── */}
        <div ref={infoRef} className="relative z-10 p-4 space-y-4">
          {/* Title + heart button */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-white font-bold text-[17px] leading-tight tracking-tight truncate">
                {song.title}
              </h2>
            </div>

            <button
              ref={heartRef}
              onClick={handleSave}
              title={saved ? "Remove from playlist" : "Save to playlist"}
              className={`
        shrink-0 w-9 h-9 rounded-full flex items-center justify-center
        border transition-colors duration-300 cursor-pointer
        ${
          saved
            ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-300"
            : "bg-white/[0.07] border-white/[0.14] text-white/40"
        }
      `}
            >
              <Heart size={16} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Meta info rows — date, duration, playlist status */}
          <div className="rounded-2xl border border-white/8 bg-white/4 overflow-hidden">
            {/* Date added */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2 text-white/35 shrink-0">
                <Calendar size={14} />
                <span className="text-[11px] font-semibold tracking-widest uppercase md:hidden lg:block">
                  Added
                </span>
              </div>
              <span className="text-[13px] font-medium text-white/75 text-right truncate">
                {formatDate(song.dateAdded)}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-white/[0.07]">
              <div className="flex items-center gap-2 text-white/35 shrink-0">
                <Clock size={14} />
                <span className="text-[11px] font-semibold tracking-widest uppercase md:hidden lg:block">
                  Duration
                </span>
              </div>
              <span className="text-[13px] font-medium text-white/75 text-right">
                {formatDuration(song.duration)}
              </span>
            </div>

            {/* Playlist status */}
            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex items-center gap-2 text-white/35 shrink-0">
                <Music size={14} />
                <span className="text-[11px] font-semibold tracking-widest uppercase md:hidden lg:block">
                  Playlist
                </span>
              </div>
              <div
                className={`
        flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-[11px] font-semibold border transition-all duration-300
        ${
          saved
            ? "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-300"
            : "bg-white/[0.06] border-white/10 text-white/35"
        }
      `}
              >
                <span
                  className={`
          w-1.5 h-1.5 rounded-full transition-all duration-300
          ${saved ? "bg-fuchsia-400" : "bg-white/25"}
        `}
                />
                {saved ? "Saved" : "Not saved"}
              </div>
            </div>
          </div>

          {/* ── Credits table ──────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.07]">
              <Mic2 size={14} className="text-white/35" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-white/35">
                Credits
              </span>
            </div>

            {/* Artist rows */}
            {song.artists.map((artist, index) => (
              <div
                key={index}
                className={`
          flex items-center justify-between gap-3 px-3 py-2.5
          ${index !== song.artists.length - 1 ? "border-b border-white/[0.07]" : ""}
        `}
              >
                <div className="flex items-center gap-2.5">
                  {/* Avatar placeholder */}
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-white/50">
                      {artist.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[13px] font-medium text-white/75">
                    {artist}
                  </span>
                </div>
                <span className="text-[11px] text-white/30 font-medium">
                  Artist
                </span>
              </div>
            ))}
          </div>

          {/* Copy link button */}
          <button
            ref={copyRef}
            onClick={handleCopy}
            className={`
      w-full flex items-center justify-center gap-2 rounded-2xl py-3
      text-[13px] font-medium border transition-all duration-300 cursor-pointer
      ${
        copied
          ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
          : "bg-white/[0.07] border-white/[0.11] text-white/60 hover:bg-white/[0.11] hover:text-white/80"
      }
    `}
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            <span>{copied ? "Link copied!" : "Copy song link"}</span>
          </button>
        </div>
      </div>
  );
}
