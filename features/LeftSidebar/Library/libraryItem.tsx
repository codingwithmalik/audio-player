"use client";

import Image from "next/image";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { ListMusic, FolderClosed } from "lucide-react";
import { useState } from "react";

const brokenImageCache = new Set<string>();

type Props = {
  item: Folder | Playlist;
};

export default function LibraryItem({ item }: Props) {
  const isFolder = item.type === "folder";
  const src = isFolder ? null : (item.coverImage ?? null);

  const [imgReady, setImgReady] = useState(
    () => (src ? false : false), // always start with icon visible
  );
  const [imgFailed, setImgFailed] = useState(
    () => (src ? brokenImageCache.has(src) : true), // no src = treat as failed immediately
  );

  const handleLoad = () => setImgReady(true);

  const handleError = () => {
    if (src) brokenImageCache.add(src);
    setImgFailed(true);
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 hover:bg-white/10 transition cursor-pointer">
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        {/* Icon is always rendered as the base — instantly visible */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${imgReady ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          {isFolder ? (
            <FolderClosed className="w-12 h-12" />
          ) : (
            <ListMusic className="w-12 h-12" />
          )}
        </div>

        {/* Image loads silently on top — fades in only when ready */}
        {src && !imgFailed && (
          <Image
            src={src}
            alt={item.title}
            fill
            className={`rounded-lg object-cover transition-opacity duration-200 ${imgReady ? "opacity-100" : "opacity-0"}`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
      </div>

      <div className="md:hidden lg:block">
        <h3 className="text-white font-medium">{item.title}</h3>
        <p className="text-sm text-zinc-400">
          {isFolder
            ? `Folder • ${item.playlistIds.length} playlists`
            : `Playlist • ${item.songIds.length} songs`}
        </p>
      </div>
    </div>
  );
}
