"use client";

import LibraryHeader from "./libraryHeader";
import LibrarySearch from "./librarySearchbar";
import LibraryList from "./libraryList";

export default function Sidebar() {
  return (
    <aside
      className="min-h-full  bg-white/5
      border-r
      border-white/10
      p-4
      overflow-y-auto
    overflow-x-hidden
      w-full
    "
    >
      <div className="relative top-0 left-0">
        <LibraryHeader />
        <div className="mt-5">
          <LibrarySearch />
        </div>
      </div>
      <LibraryList />
    </aside>
  );
}
