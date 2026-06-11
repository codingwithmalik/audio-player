"use client";

import LibraryItem from "./libraryItem";
import { Folder, Playlist } from "@/features/LeftSidebar/Library/libraryTypes";
import { useAppSelector } from "@/globalHooks";
import { selectFilteredItems } from "./libraryslice";

export default function LibraryList() {
  const items = useAppSelector(selectFilteredItems);

  return (
    <div className="flex flex-col gap-1 mt-5">
      {items.map((item) => (
        <LibraryItem key={item.id} item={item as Folder | Playlist} />
      ))}
    </div>
  );
}
