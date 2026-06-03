"use client";

import { Search, ListFilter } from "lucide-react";

import {
  setSearch,
  setSort,
} from "@/features/LeftSidebar/Library/libraryslice";

import { useAppDispatch, useAppSelector } from "@/globalHooks";

export default function LibrarySearch() {
  const dispatch = useAppDispatch();

  const sort = useAppSelector((state) => state.library.sort);

  return (
    <div className="hidden lg:flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-2 flex-1">
        <Search size={18} />

        <input
          placeholder="Search in library"
          className="bg-transparent outline-none text-sm w-full"
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>

      <select
        value={sort}
        onChange={(e) => dispatch(setSort(e.target.value as "folders" | "playlists" | "mixed"))}
        className="bg-transparent text-sm outline-none"
      >
        <option value="folders">Folders</option>

        <option value="playlists">Playlists</option>

        <option value="mixed">Mixed</option>
      </select>
    </div>
  );
}
