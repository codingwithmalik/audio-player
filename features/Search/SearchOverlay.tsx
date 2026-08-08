"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectQuery,
  songSearchedAndPlayed,
  removeRecentSearch,
  clearRecentSearches,
} from "@/features/Search/searchSlice";
import { selectRecentSearchSongs } from "@/features/Search/searchSelectors";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { setSong } from "@/slices/playerSlice";
import SearchResultRow from "./SearchResultRow";
import SearchResultListSkeleton from "./Animations/SearchResultRowSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";
import {
  useGetRecentSearchesQuery,
  useAddRecentSearchMutation,
  useRemoveRecentSearchRemoteMutation,
  useClearRecentSearchesRemoteMutation,
  useSearchQuery,
} from "@/features/Search/searchApi";

interface SearchOverlayProps {
  variant: "dropdown" | "page";
  className?: string;
}

export default function SearchOverlay({
  variant,
  className = "",
}: SearchOverlayProps) {
  const {
    isLoading: recentLoading,
    isError: recentError,
    refetch: refetchRecent,
  } = useGetRecentSearchesQuery();
  const [addRecentSearch] = useAddRecentSearchMutation();
  const [removeRecentSearchRemote] = useRemoveRecentSearchRemoteMutation();
  const [clearRecentSearchesRemote] = useClearRecentSearchesRemoteMutation();
  const dispatch = useAppDispatch();
  const query = useAppSelector(selectQuery);
  const recentSongs = useAppSelector(selectRecentSearchSongs);
  const [skip, setSkip] = useState(0);
  const {
    data: searchData,
    isLoading: searchLoading,
    isFetching,
    isError: searchError,
    refetch: refetchSearch,
  } = useSearchQuery({ q: query, skip }, { skip: query.trim().length === 0 });
  const results = searchData?.songs ?? [];
  const hasMore = searchData?.hasMore ?? false;

  const isEmpty = query.trim().length === 0;
  const list = isEmpty ? recentSongs : results;
  const displayed = isEmpty ? recentSongs.slice(0, 100) : results;

  useEffect(() => {
    setSkip(0);
  }, [query]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || isEmpty || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkip((s) => s + 20);
        }
      },
      { root: null, rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching, isEmpty]);

  const handlePlay = (songId: string) => {
    const ids = list.map((s) => s.id);
    const reordered = [songId, ...ids.filter((id) => id !== songId)];
    dispatch(
      setQueue({ songIds: reordered, sourceType: "search", sourceId: null }),
    );
    dispatch(setCurrentIndex(0));
    dispatch(setSong(songId));
    dispatch(songSearchedAndPlayed(songId));
    addRecentSearch(songId);
  };

  // ── Recent searches: loading / error take priority over the empty-state text ──
  if (isEmpty && recentError) {
    return (
      <div className={className}>
        <ErrorState
          message="Couldn't load recent searches."
          onRetry={refetchRecent}
          compact
        />
      </div>
    );
  }
  if (isEmpty && recentLoading) {
    return (
      <div className={className}>
        <SearchResultListSkeleton />
      </div>
    );
  }

  // ── Live search: loading / error ──
  if (!isEmpty && searchError) {
    return (
      <div className={className}>
        <ErrorState
          message={`Couldn't search for "${query}".`}
          onRetry={refetchSearch}
          compact
        />
      </div>
    );
  }
  if (!isEmpty && searchLoading) {
    return (
      <div className={className}>
        <SearchResultListSkeleton />
      </div>
    );
  }

  const resultRows = (
    <>
      {displayed.map((song) => (
        <SearchResultRow
          key={song.id}
          song={song}
          onClick={() => handlePlay(song.id)}
          onRemove={
            isEmpty
              ? () => {
                  dispatch(removeRecentSearch(song.id));
                  removeRecentSearchRemote(song.id);
                }
              : undefined
          }
        />
      ))}
      {!isEmpty && hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center py-3"
        >
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-white/40" />
          )}
        </div>
      )}
    </>
  );

  return (
    <div className={className}>
      {isEmpty && recentSongs.length > 0 && (
        <div className="flex items-center justify-between px-2 pt-2 pb-1">
          <h3 className="text-sm font-bold text-white">Recent searches</h3>
          <button
            onClick={() => {
              dispatch(clearRecentSearches());
              clearRecentSearchesRemote();
            }}
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
          className="max-h-105  backdrop-blur-[800px] rounded-md"
        >
          <div className="flex flex-col gap-0.5 px-1 pb-2">{resultRows}</div>
        </OverlayScrollbarsComponent>
      ) : (
        <div className="flex flex-col gap-0.5 px-1 pb-2">{resultRows}</div>
      )}
    </div>
  );
}
