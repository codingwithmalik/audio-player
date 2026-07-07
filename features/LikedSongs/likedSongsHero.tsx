"use client";

import { Heart } from "lucide-react";

interface LikedSongsHeroProps {
  songCount: number;
  totalDurationLabel: string;
  ownerName: string ;
}
export default function LikedSongsHero({
  songCount,
  totalDurationLabel,
  ownerName
}: LikedSongsHeroProps) {
  return (
    <div
      className="relative w-full"
      style={{
        background:
          "linear-gradient(180deg, #280d51 0%, #4c1d9544 60%, transparent 100%)",
      }}
    >
      {/* ── Mobile ── */}
      <div className="block sm:hidden w-full">
        <div className="flex justify-center pt-8 px-10">
          <div className="w-[90%] aspect-square rounded-2xl bg-linear-to-br from-purple-900 to-indigo-900 flex items-center justify-center shadow-2xl">
            <Heart className="w-24 h-24 text-white fill-white" />
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 pt-4 pb-2">
          <h1
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(1.8rem, 8vw, 3rem)" }}
          >
            Liked Songs
          </h1>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <span className="text-sm text-white/60">
              {songCount} songs, {totalDurationLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tablet + Desktop ── */}
      <div className="hidden sm:flex items-end gap-6 p-6">
        {/* Icon box */}
        <div className="w-54 h-54 shrink-0 rounded-2xl bg-linear-to-br from-purple-900 to-indigo-900 flex items-center justify-center shadow-2xl">
          <Heart className="w-28 h-28 text-white fill-white" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 min-w-0 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
            Playlist
          </p>
          <h1
            className="font-black text-white leading-none"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
          >
            Liked Songs
          </h1>
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-1 shrink-0">
              <span className="text-[10px] font-bold text-white">
                {ownerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-semibold text-white hover:underline cursor-pointer">
              {ownerName}
            </span>
            <span className="text-sm text-white/60 font-medium">
              {songCount} songs,{" "}
              <span className="text-white/60">{totalDurationLabel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
