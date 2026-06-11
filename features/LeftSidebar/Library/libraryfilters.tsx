"use client";

import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { toggleFilter, clearFilters } from "./libraryslice";
import { FilterType } from "./libraryTypes";
import { FolderClosed, ListMusic, X} from "lucide-react";

// ─── Filter pill config ───────────────────────────────────────────────────────

const FILTERS: { value: FilterType; label: string; icon: React.ElementType }[] =
  [
    { value: "playlists", label: "Playlists", icon: ListMusic },
    { value: "folders", label: "Folders", icon: FolderClosed },
  ];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * LibraryFilters
 *
 * Sits between LibraryHeader and LibrarySearch, exactly like Spotify.
 * Each pill toggles independently — multiple can be active at once.
 * When all are off, the full library is shown.
 */
export default function LibraryFilters() {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector((state) => state.library.filters);

  const handleToggle = (filter: FilterType) => {
    dispatch(toggleFilter(filter));
  };

  return (
    <div className="flex md:hidden lg:flex items-center justify-center gap-2 pt-4 pb-1 ">
      {activeFilters.length > 0 && (
        <button
          type="button"
          onClick={() => dispatch(clearFilters())}
          className=" flex h-8 w-8 shrink-0 items-center justify-center
            rounded-full bg-white/10 text-white
            transition hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
      )}
      <div className="flex items-center w-full gap-2">
        {FILTERS.map(({ value, label, icon: Icon }) => {
          const isActive = activeFilters.includes(value);

          return (
            <button
              key={value}
              onClick={() => handleToggle(value)}
              className={`
              flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5
              text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }
            `}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
