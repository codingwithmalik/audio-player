"use client";

import Image from "next/image";
import { Folder, Playlist } from "@/features/LeftSidebar/Library/libraryTypes";
import { ListMusic, FolderClosed } from "lucide-react";
import { useState } from "react";
type Props = {
  item: Folder | Playlist;
};

export default function LibraryItem({ item }: Props) {
  const isFolder = item.type === "folder";
  const [hasError, setHasError] = useState(false);
  const src = isFolder ? item.icon : item.coverImage;

  return (
    <div className="group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 hover:bg-white/10 transition cursor-pointer">
      <div className="relative w-14 h-14 shrink-0">
        {hasError || !src ? (
          isFolder ? (
            <FolderClosed className="w-12 h-12" />
          ) : (
            <ListMusic className="w-12 h-12" />
          )
        ) : (<Image
            src={src}
            alt={item.title}
            fill
            className="rounded-lg object-cover"
            onError={() => setHasError(true)}
          />
      )}
      </div>
      <div className="md:hidden lg:block">
        <h3 className="text-white font-medium">{item.title}</h3>

        <p className="text-sm text-zinc-400">
          {isFolder
            ? `Folder • ${item.playlistsCount} playlists`
            : `Playlist • ${item.songsCount} songs`}
        </p>
      </div>
    </div>
  );
}
