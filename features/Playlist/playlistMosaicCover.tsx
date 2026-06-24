"use client";

import Image from "next/image";
import { ListMusic } from "lucide-react";
import { useState } from "react";

interface PlaylistMosaicCoverProps {
  coverImage?: string;
  songCovers: (string | undefined)[];
  title: string;
  size?: number;
}

export default function PlaylistMosaicCover({
  coverImage,
  songCovers,
  title,
  size = 224,
}: PlaylistMosaicCoverProps) {
  const [playlistReady, setPlaylistReady] = useState(false);
  const [playlistFailed, setPlaylistFailed] = useState(false);

  const [mosaicReady, setMosaicReady] = useState(false);
  const [mosaicFailed, setMosaicFailed] = useState(false);

  const slots = Array.from({ length: 4 }, (_, i) => songCovers[i]);
  const half = size / 2;

  return (
    <div
      className="relative rounded-md overflow-hidden shadow-2xl shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${title} cover`}
    >
      {/* Base fallback icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <ListMusic className="w-16 h-16 text-zinc-200 " />
      </div>

      {/* Playlist cover */}
      {coverImage && !playlistFailed && (
        <Image
          src={coverImage}
          alt={title}
          fill
          draggable={false}
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
            {slots.map((src, i) => (
              src &&
              <Image
                key={i}
                src={src!}
                alt=""
                width={half}
                height={half}
                draggable={false}
                className="object-cover"
                style={{ width: half, height: half }}
                onLoad={() => {
                  if (i === 3) setMosaicReady(true);
                }}
                onError={() => setMosaicFailed(true)}
              />
            ))}
          </div>
        )}
    </div>
  );
}
