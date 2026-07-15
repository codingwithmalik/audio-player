"use client";

import Image from "next/image";
import { Heart, ListMusic } from "lucide-react";
import { useState } from "react";

interface PlaylistMosaicCoverProps {
  coverImage?: string;
  songCovers: (string | undefined)[];
  title: string;
  isLikedPlaylist?: boolean;
}

export default function PlaylistMosaicCover({
  coverImage,
  songCovers,
  title,
  isLikedPlaylist = false,
}: PlaylistMosaicCoverProps) {
  const [playlistReady, setPlaylistReady] = useState(false);
  const [playlistFailed, setPlaylistFailed] = useState(false);
  const [mosaicReady, setMosaicReady] = useState(false);
  const [mosaicFailed, setMosaicFailed] = useState(false);

  const slots = Array.from({ length: 4 }, (_, i) => songCovers[i]);
  // Liked Songs — always show heart, skip cover/mosaic logic entirely
  if (isLikedPlaylist) {
    return (
      <div
        className="relative w-full h-full rounded-md overflow-hidden bg-linear-to-br from-purple-900 to-indigo-900 flex items-center justify-center"
        role="img"
        aria-label="Liked Songs"
      >
        <Heart className="w-1/2 h-1/2 text-white fill-white" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full rounded-md overflow-hidden shadow-2xl"
      role="img"
      aria-label={`${title} cover`}
    >
      {/* Base fallback icon — capped at an absolute max so it doesn't blow up on large containers */}
      <div className="absolute inset-0 flex items-center justify-center p-[15%]">
        <ListMusic className="w-full h-full max-w-32 max-h-32 text-zinc-200" />
      </div>

      {/* Single playlist cover */}
      {coverImage && !playlistFailed && (
        <Image
          src={coverImage}
          alt={title}
          fill
          priority
          draggable={false}
          sizes="(max-width: 768px) 96px, 160px"
          className={`object-cover transition-opacity duration-200 ${
            playlistReady ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setPlaylistReady(true)}
          onError={() => setPlaylistFailed(true)}
        />
      )}

      {/* Mosaic fallback */}
      {(!coverImage || playlistFailed) &&
        !mosaicFailed &&
        slots.length === 4 && (
          <div
            className={`absolute inset-0 grid grid-cols-2 transition-opacity duration-200 ${
              mosaicReady ? "opacity-100" : "opacity-0"
            }`}
          >
            {slots.map((src, i) =>
              src ? (
                <div key={i} className="relative w-full h-full">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 48px, 80px"
                    draggable={false}
                    className="object-cover"
                    onLoad={() => {
                      if (i === 3) setMosaicReady(true);
                    }}
                    onError={() => setMosaicFailed(true)}
                  />
                </div>
              ) : (
                <div key={i} className="bg-white/10" />
              ),
            )}
          </div>
        )}
    </div>
  );
}
