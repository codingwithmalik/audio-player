"use client";

import LibraryItem from "./libraryItem";
import { Folder, Playlist } from "@/features/LeftSidebar/Library/libraryTypes";
import { useAppSelector } from "@/globalHooks";

export default function LibraryList() {
  const { items, search, sort } =
    useAppSelector(
      (state) => state.library
    );

  let filtered = items.filter((item) =>
    item.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (sort === "folders") {
    filtered = filtered.sort((a, b) => {
      if (a.type === "folder") return -1;
      if (b.type === "folder") return 1;

      return a.title.localeCompare(b.title);
    });
  }

  if (sort === "playlists") {
    filtered = filtered.sort((a, b) => {
      if (a.type === "playlist")
        return -1;

      if (b.type === "playlist")
        return 1;

      return a.title.localeCompare(b.title);
    });
  }

  if (sort === "mixed") {
    filtered = filtered.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }
  return (
    <div className="flex flex-col gap-1 mt-5 spotify-scrollbar">
      {filtered.map((item) => (
        <LibraryItem
          key={item.id}
          item={item as Folder | Playlist}
        />
      ))}
    </div>
  );
}