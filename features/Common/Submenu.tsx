"use client";

import React, { useState } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { LucideIcon } from "lucide-react";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubOption = {
  id: string;
  label?: string;
  icon?: LucideIcon;
  action?: () => void;
  separatorAbove?: boolean;
  searchable?: boolean;
  cover?: {
    coverImage?: string;
    songCovers?: (string | undefined)[];
    isLikedPlaylist?: boolean;
  };
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Submenu({
  options,
  searchPlaceholder,
  inline = false,
  maxHeight = 220,
  position = "right",
}: {
  options: SubOption[];
  searchPlaceholder: string;
  inline?: boolean;
  maxHeight?: number | string;
  position?: "right" | "left";
}) {
  const [query, setQuery] = useState("");

  const searchable = options.find((o) => o.searchable);
  const items = options
    .filter((o) => !o.searchable)
    .filter((o) =>
      query.trim()
        ? o.label?.toLowerCase().includes(query.toLowerCase())
        : true,
    );

  return (
    <div
      className={
        inline
          ? "w-full md:py-1"
          : position === "right"
            ? "absolute left-full top-0 ml-1 w-54 bg-[#2C0E3B] border border-white/10 rounded-xl shadow-2xl py-2 z-600"
            : "absolute right-full -top-2 w-54 bg-[#2C0E3B] border border-white/10 rounded-xl shadow-2xl py-2 z-600"
      }
    >
      {/* Search input — hidden on mobile since sheet handles it inline */}
      {searchable && (
        <div className="px-3 pb-2 max-md:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-purple-600 transition-colors"
          />
        </div>
      )}

      <OverlayScrollbarsComponent
        options={{ scrollbars: { autoHide: "scroll" } }}
        style={{ maxHeight }}
      >
        {items.map((sub) => {
          const SubIcon = sub.icon;
          return (
            <React.Fragment key={sub.id}>
              <button
                onClick={sub.action}
                className="group/sub w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/10 transition-colors min-w-0"
              >
                {sub.cover ? (
                  <div className="relative w-8 h-8 shrink-0">
                    <PlaylistMosaicCover
                      coverImage={sub.cover.coverImage}
                      songCovers={sub.cover.songCovers ?? []}
                      title={sub.label ?? ""}
                      isLikedPlaylist={sub.cover.isLikedPlaylist}
                    />
                  </div>
                ) : (
                  SubIcon && (
                    <SubIcon className="w-4 h-4 shrink-0 text-white/60 group-hover/sub:text-purple-600 transition-colors" />
                  )
                )}
                <span className="text-white group-hover/sub:text-purple-600 transition-colors truncate">
                  {sub.label}
                </span>
              </button>
              {sub.separatorAbove && (
                <div className="border-t border-white/10" />
              )}
            </React.Fragment>
          );
        })}

        {items.length === 0 && (
          <p className="px-4 py-3 text-xs text-white/30">No results</p>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
}
