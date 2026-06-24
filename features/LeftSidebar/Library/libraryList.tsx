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
  // Playlists inside a folder belong to that folder's view, not the root library
  const rootItems = items.filter(
    (item) => item.type === "folder" || item.folderId === null,
  );
  if (!isAuthenticated) {
    return (
      <div className="mt-5 px-2 text-sm text-zinc-500 text-center">
        Log in to see your library
        <div className="flex md:hidden m-2">
        <HeaderAuth/>
        </div>
      </div>
    );
  }

  if (rootItems.length === 0) {
    return (
      <div className="mt-5 px-2 text-sm text-zinc-500 text-center">
        No playlists or folders yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-5">
      {rootItems.map((item) => (
        <LibraryItem key={item.id} item={item as Folder | Playlist} />
      ))}
    </div>
  );
}
