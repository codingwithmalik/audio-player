"use client";

import LibraryItem from "./libraryItem";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { useAppSelector } from "@/globalHooks";
import { selectFilteredItems } from "./libraryslice";
import { selectLikedCount } from "@/features/LikedSongs/likedSongsSlice";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LibraryList() {
  const items      = useAppSelector(selectFilteredItems);
  const likedCount = useAppSelector(selectLikedCount);
  const router     = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const rootItems = items.filter(
    (item) => item.type === "folder" || item.folderId === null
  );

  if (!isAuthenticated) {
    return (
      <div className="mt-5 px-2 text-sm text-zinc-500 text-center">
        Log in to see your library
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-5">
      {/* Liked Songs — always pinned at top */}
      <button
        onClick={() => router.push("/collection/tracks")}
        className="group flex items-center gap-3 rounded-xl lg:p-1 pl-0 py-1 hover:bg-white/10 transition cursor-pointer w-full"
      >
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-lg bg-linear-to-br from-purple-700 to-indigo-900">
          <Heart className="w-7 h-7 text-white fill-white" />
        </div>
        <div className="md:hidden lg:block text-left">
          <h3 className="text-white font-medium">Liked Songs</h3>
          <p className="text-sm text-zinc-400">
            Playlist • {likedCount} {likedCount === 1 ? "song" : "songs"}
          </p>
        </div>
      </button>

      {/* User playlists and folders */}
      {rootItems.length === 0 ? (
        <div className="mt-3 px-2 text-sm text-zinc-500 text-center">
          No playlists or folders yet
        </div>
      ) : (
        rootItems.map((item) => (
          <LibraryItem key={item.id} item={item as Folder | Playlist} />
        ))
      )}
    </div>
  );
}