"use client";

import { useState, useRef, useEffect } from "react";
import { Search, List, Check } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { setSearch, setSort } from "./libraryslice";
import { SortType } from "./libraryTypes";

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "recents", label: "Recents" },
  { value: "recently-added", label: "Recently Added" },
  { value: "alphabetical", label: "Alphabetical" },
];

export default function LibrarySearch() {
  const dispatch = useAppDispatch();
  const sort = useAppSelector((state) => state.library.sort);

  const [searchOpen, setSearchOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Focus input when search opens
  const ToggleSearch = () => {
    if (searchOpen) return;
    setSearchOpen(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  const currentLabel =
    SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Recents";

  return (
    <div className="flex md:hidden lg:flex items-center justify-between gap-2">
      {/* Search — icon toggles input */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={() => ToggleSearch()}
          className="shrink-0 text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle search"
        >
          <Search size={16} />
        </button>

        {searchOpen && (
          <input
            ref={inputRef}
            placeholder="Search in library"
            className="bg-transparent outline-none text-sm w-full text-white placeholder:text-zinc-500 border-b border-zinc-600 pb-0.5"
            onChange={(e) => dispatch(setSearch(e.target.value))}
            onBlur={() => setSearchOpen(false)}
          />
        )}
      </div>

      {/* Sort — custom dropdown, no native select */}
      <div ref={sortRef} className="relative shrink-0">
        <button
          onClick={() => setSortOpen((o) => !o)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          {currentLabel}
          <List size={15} />
        </button>

        {sortOpen && (
          <div className="absolute right-0 top-7 z-50 w-44 rounded-lg bg-[#1a0a2e] border border-white/10 py-1 shadow-xl">
            {SORT_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  dispatch(setSort(o.value));
                  setSortOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {o.label}
                {sort === o.value && (
                  <Check size={14} className="text-green-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
