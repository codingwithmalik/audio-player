"use client";

import Link from "next/link";
import Image from "next/image";
import { RefObject, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { Music2, Bookmark, BookmarkCheck } from "lucide-react";

import {
  toggleSaved,
  selectSong,
  selectIsPlaying,
  selectIsSaved,
  Song,
} from "@/store/playerSlice";

// ─── Component ─────────────────────────────────────────────────────────────────

/**
 * SongInfo — LEFT column of the player bar.
 *
 * Renders:
 *  • Album / cover art thumbnail (with animated EQ bars while playing)
 *  • Song title (links to the track or source playlist)
 *  • Artist name
 *  • Save / bookmark toggle (with GSAP bounce feedback)
 *
 * All state is read from Redux; no local state is required here.
 */

// ── Shared cover-art markup ───────────────────────────────────────────────
const CoverArt = ({
  song,
  isPlaying,
  size,
}: {
  song: Song;
  isPlaying: boolean;
  size: "sm" | "md";
}) => {
  const dim =
    size === "sm"
      ? "h-10 w-10 rounded-lg"
      : "h-11 w-11 rounded-xl lg:h-12 lg:w-12";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4 lg:h-5 lg:w-5";
  const barW = size === "sm" ? "w-0.5" : "w-[3px]";
  const barPb = size === "sm" ? "pb-1" : "pb-1.5";
  const barH = size === "sm" ? [4, 6, 8] : [6, 9, 12];
  const [ImgError, setImgError] = useState(false);
  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-white/10 bg-white/5 shadow-[0_4px_16px_rgba(0,0,0,0.5)] ${dim}`}
    >
      {ImgError ? (
        <div className="flex h-full w-full items-center justify-center">
          <Music2 className={`text-white/30 ${iconSize}`} />
        </div>
      ) : song.coverImage ? (
        <Image
          src={song.coverImage}
          alt={song.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Music2 className={`text-white/30 ${iconSize}`} />
        </div>
      )}

      {/* Animated EQ bars overlay while playing */}
      {isPlaying && (
        <div
          className={`absolute inset-0 flex items-end justify-center gap-[2px] bg-black/40 ${barPb}`}
        >
          {barH.map((h, i) => (
            <span
              key={i}
              className={`rounded-full bg-purple-400 ${barW}`}
              style={{
                animation: `eq-bar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                height: `${h}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

type saveIconRef = RefObject<HTMLButtonElement | null>;
// ── Save button (shared between mobile and desktop) ───────────────────────
const SaveButton = ({
  saveIconRef,
  handleSaveToggle,
  isSaved,
  className = "",
}: {
  saveIconRef: saveIconRef;
  handleSaveToggle: () => void;
  isSaved: boolean;
  className?: string;
}) => (
  <button
    ref={saveIconRef}
    onClick={handleSaveToggle}
    aria-label={isSaved ? "Remove from playlist" : "Save to playlist"}
    className={`flex shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
      isSaved
        ? "text-purple-400 hover:text-purple-300"
        : "text-neutral-600 hover:text-neutral-300"
    } ${className}`}
  >
    {isSaved ? (
      <BookmarkCheck className="h-[18px] w-[18px]" />
    ) : (
      <Bookmark className="h-[18px] w-[18px]" />
    )}
  </button>
);

export default function SongInfo() {
  const dispatch = useDispatch();
  const song = useSelector(selectSong);
  const isPlaying = useSelector(selectIsPlaying);
  const isSaved = useSelector(selectIsSaved);

  // Ref used only for the GSAP save animation — not for state
  const saveIconRef = useRef<HTMLButtonElement | null>(null);

  if (!song) return null;

  const songHref = song.sourceSlug ?? `/songs/${song.id}`;

  // ── Save toggle with GSAP bounce ──────────────────────────────────────────
  const handleSaveToggle = () => {
    dispatch(toggleSaved());

    if (!saveIconRef.current) return;
    if (!isSaved) {
      // Saving → satisfying "pop" up
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
      // Removing → quick shrink yoyo
      gsap.to(saveIconRef.current, {
        scale: 0.85,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  return (
    <>
      {/* ── MOBILE ─────────────────────────────────────────────────────────── */}
      {/* Visible only below md; rendered as part of the mobile stacked layout */}
      <div className="flex items-center gap-2.5 md:hidden">
        <CoverArt song={song} isPlaying={isPlaying} size="sm" />

        <div className="min-w-0 flex-1">
          <Link
            href={songHref}
            className="block truncate text-sm font-semibold text-white transition-colors hover:text-white/70"
          >
            {song.title}
          </Link>
          <p className="truncate text-[11px] text-neutral-500">
            {song.artists.join(", ")}
          </p>
        </div>
      </div>

      {/* ── DESKTOP ────────────────────────────────────────────────────────── */}
      {/* Fixed-width left column inside the three-column flex layout */}
      <div
        className="hidden min-w-0 items-center gap-2.5 md:flex lg:gap-3"
        style={{ width: "clamp(200px, 22%, 280px)", flexShrink: 0 }}
      >
        <CoverArt song={song} isPlaying={isPlaying} size="md" />

        <div className="min-w-0 flex-1">
          <Link
            href={songHref}
            className="block truncate text-sm font-semibold text-white transition-colors hover:text-white/70"
          >
            {song.title}
          </Link>
          <p className="truncate text-xs text-neutral-500">
            {song.artists.join(", ")}
          </p>
        </div>

        <SaveButton
          saveIconRef={saveIconRef}
          handleSaveToggle={handleSaveToggle}
          isSaved={isSaved}
          className="h-8 w-8"
        />
      </div>

      {/* Save button surfaced separately for mobile Row-1 (Player.tsx renders it) */}
      {/* We export a named slot so Player.tsx can place it in the right spot   */}
    </>
  );
}

// ── Named export so Player can render the save button at mobile breakpoint ──
export function MobileSaveButton() {
  const dispatch = useDispatch();
  const isSaved = useSelector(selectIsSaved);
  const saveRef = useRef<HTMLButtonElement>(null);

  const handleSaveToggle = () => {
    dispatch(toggleSaved());
    if (!saveRef.current) return;
    if (!isSaved) {
      gsap
        .timeline()
        .to(saveRef.current, {
          scale: 1.35,
          duration: 0.15,
          ease: "power2.out",
        })
        .to(saveRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "elastic.out(1.5,0.5)",
        });
    } else {
      gsap.to(saveRef.current, {
        scale: 0.85,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  return (
    <button
      ref={saveRef}
      onClick={handleSaveToggle}
      aria-label={isSaved ? "Remove from playlist" : "Save to playlist"}
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
        isSaved
          ? "text-purple-400 hover:text-purple-300"
          : "text-neutral-600 hover:text-neutral-300"
      }`}
    >
      {isSaved ? (
        <BookmarkCheck className="h-4.25 w-4.25" />
      ) : (
        <Bookmark className="h-4.25 w-4.25" />
      )}
    </button>
  );
}
