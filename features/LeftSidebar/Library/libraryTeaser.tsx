// features/LeftSidebar/Library/LibraryTeaser.tsx
"use client";

import Link from "next/link";
import { ListMusic, FolderClosed } from "lucide-react";

export default function LibraryTeaser() {
  return (
    <div className="relative w-full min-w-full h-full min-h-100">
      {/* Fake content behind the blur — same shapes as the real header/filters/list,
          just static placeholders, so the blur implies real substance. */}
      <div className="pointer-events-none select-none blur-sm opacity-60 flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Library</h2>
          <div className="w-8 h-8 rounded-full bg-white/10" />
        </div>

        <div className="flex gap-2 mb-4">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/10 text-xs">
            <ListMusic className="w-3.5 h-3.5" /> Playlists
          </span>
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-white/10 text-xs">
            <FolderClosed className="w-3.5 h-3.5" /> Folders
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-1">
              <div className="w-14 h-14 rounded-md bg-white/10 shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-3.5 w-2/3 bg-white/10 rounded" />
                <div className="h-3 w-1/3 bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login CTA, centered over the blur */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-white text-base font-semibold">
          Log in to see your library
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
