"use client";

import LibraryItem from "./libraryItem";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { useAppSelector } from "@/globalHooks";
import { selectFilteredItems } from "./libraryslice";
import HeaderAuth from "@/features/Header/headerAuth";

export default function LibraryList() {
  const items = useAppSelector(selectFilteredItems);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const rootItems = items.filter(
    (item) => item.type === "folder" || item.folderId === null,
  );

  if (!isAuthenticated) {
    return (
      <div className="mt-5 px-2 text-sm text-zinc-500 text-center">
        Log in to see your library
        <HeaderAuth />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-5">
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
