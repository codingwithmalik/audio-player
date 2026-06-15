"use client";

import LibraryItem from "./libraryItem";
import { Playlist } from "@/types/playlist";
import { Folder } from "@/types/folder";
import { useAppSelector } from "@/globalHooks";
import { selectFilteredItems } from "./libraryslice";

export default function LibraryList() {
  const items = useAppSelector(selectFilteredItems);

  // Playlists inside a folder belong to that folder's view, not the root library
  const rootItems = items.filter(
    (item) => item.type === "folder" || item.folderId === null
  );

  return (
    <div className="flex flex-col gap-1 mt-5">
      {rootItems.map((item) => (
        <LibraryItem key={item.id} item={item as Folder | Playlist} />
      ))}
    </div>
  );
}