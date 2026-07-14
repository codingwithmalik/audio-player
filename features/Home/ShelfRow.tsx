"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ShelfTile from "./ShelfTile";

export interface ShelfPlaylistItem {
  kind: "playlist";
  id: string;
  title: string;
  coverImage?: string;
  songCovers: (string | undefined)[];
  isLikedPlaylist?: boolean;
  onClick: () => void;
  onPlay?: () => void;
}

export interface ShelfSongItem {
  kind: "song";
  id: string;
  title: string;
  subtitle?: string;
  coverImage?: string;
  onClick: () => void;
}

export type ShelfItem = ShelfPlaylistItem | ShelfSongItem;

interface ShelfRowProps {
  title: string;
  items: ShelfItem[];
  hasMore?: boolean;
  onShowAll?: () => void;
}

const SCROLL_AMOUNT = 640;

export default function ShelfRow({
  title,
  items,
  hasMore,
  onShowAll,
}: ShelfRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, items.length]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="mb-8 group/shelf">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {hasMore && onShowAll && (
          <button
            onClick={onShowAll}
            className="text-sm font-semibold text-zinc-400 hover:text-white hover:underline"
          >
            Show all
          </button>
        )}
      </div>

      {/* Scroll wrapper — overlays now sized to THIS, not the whole section */}
      <div className="relative">
        {canScrollLeft && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-purple-900/70 backdrop-blur-sm hover:bg-purple-700 hover:scale-105 flex items-center justify-center shadow-lg opacity-0 group-hover/shelf:opacity-100 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        {canScrollRight && (
          <>
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-purple-900/70 backdrop-blur-sm hover:bg-purple-700 hover:scale-105 flex items-center justify-center shadow-lg opacity-0 group-hover/shelf:opacity-100 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        >
          {items.map((item) => (
            <div key={item.id} className="flex-none w-40">
              <ShelfTile item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
