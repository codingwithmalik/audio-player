"use client";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectQuery,
  songSearchedAndPlayed,
  removeRecentSearch,
  clearRecentSearches,
} from "@/features/Search/searchSlice";
import {
  selectSearchResults,
  selectRecentSearchSongs,
} from "@/features/Search/searchSelectors";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { setSong } from "@/slices/playerSlice";
import SearchResultRow from "./SearchResultRow";
import type { RootState } from "@/store/store";

interface SearchOverlayProps {
  variant: "dropdown" | "page";
  className?: string;
}

export default function SearchOverlay({
  variant,
  className = "",
}: SearchOverlayProps) {
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);
  const recentSongs = useAppSelector(selectRecentSearchSongs);
  const results = useAppSelector((s: RootState) =>
    selectSearchResults(s, query),
  );

  const isEmpty = query.trim().length === 0;
  const list = isEmpty ? recentSongs : results;
  const cap = isEmpty ? 100 : 50;
  const displayed = list.slice(0, cap);

  const handlePlay = (songId: string) => {
    const ids = list.map((s) => s.id);
    const reordered = [songId, ...ids.filter((id) => id !== songId)];
    dispatch(
      setQueue({ songIds: reordered, sourceType: "search", sourceId: null }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(songId));
    dispatch(songSearchedAndPlayed(songId));
  };

  return (
    <div className={className}>
      {isEmpty && recentSongs.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <h3 className="text-sm font-bold text-white">Recent searches</h3>
          <button
            onClick={() => dispatch(clearRecentSearches())}
            className="text-xs text-zinc-400 hover:text-white hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {displayed.length === 0 ? (
        <p className="px-3 py-6 text-sm text-zinc-400 text-center">
          {isEmpty ? "No recent searches yet." : `No results for "${query}"`}
        </p>
      ) : variant === "dropdown" ? (
        <OverlayScrollbarsComponent
          defer
          options={{
            scrollbars: {
              theme: "os-theme-light",
              autoHide: "leave",
              autoHideDelay: 0,
            },
          }}
          className="max-h-105  backdrop-blur-[800px]"
        >
          <div className="flex flex-col gap-0.5 px-1 pb-2">
            {displayed.map((song) => (
              <SearchResultRow
                key={song.id}
                song={song}
                onClick={() => handlePlay(song.id)}
                onRemove={
                  isEmpty
                    ? () => dispatch(removeRecentSearch(song.id))
                    : undefined
                }
              />
            ))}
          </div>
        </OverlayScrollbarsComponent>
      ) : (
        <div className="flex flex-col gap-0.5 px-1 pb-2">
          {displayed.map((song) => (
            <SearchResultRow
              key={song.id}
              song={song}
              onClick={() => handlePlay(song.id)}
              onRemove={
                isEmpty
                  ? () => dispatch(removeRecentSearch(song.id))
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
