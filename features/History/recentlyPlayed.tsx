"use client";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { selectRecentSongIds } from "@/slices/historySlice";
import { selectSongById } from "@/features/Songs/songsSlice";
import { setSong } from "@/slices/playerSlice";
import type { RootState } from "@/store/store";
import SongCover from "@/features/Common/SongCover";
import RecentlyPlayedRowSkeleton from "./Animations/RecentlyPlayedRowSkeleton";
import ErrorState from "@/features/Common/Animations/ErrorState";
import {
  useClearHistoryRemoteMutation,
  useGetHistoryQuery,
} from "@/features/History/historyApi";
import { useGetSongsByIdsQuery } from "@/features/Songs/songsApi";

export default function RecentlyPlayed() {
  const {
    isLoading: historyLoading,
    isError: historyError,
    refetch: refetchHistory,
  } = useGetHistoryQuery();
  const recentSongIds = useAppSelector(selectRecentSongIds);
  const [clearHistoryRemote] = useClearHistoryRemoteMutation();

  // Same fix as Home's Jump Back In — history returns ids only, this was
  // the missing piece that actually fetches the song objects behind them.
  const {
    isLoading: songsLoading,
    isError: songsError,
    refetch: refetchSongs,
  } = useGetSongsByIdsQuery(recentSongIds, {
    skip: recentSongIds.length === 0,
  });

  if (historyError || songsError) {
    return (
      <div className="px-4 py-4">
        <ErrorState
          message="Couldn't load recently played songs."
          onRetry={() => {
            refetchHistory();
            refetchSongs();
          }}
        />
      </div>
    );
  }

  if (historyLoading || (recentSongIds.length > 0 && songsLoading)) {
    return (
      <div className="px-4 py-4 flex flex-col gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <RecentlyPlayedRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (recentSongIds.length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center px-4 text-center text-sm text-white/40">
        No recently played songs yet
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between px-2 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          Recently Played
        </h3>
        <button
          onClick={() => clearHistoryRemote()}
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex flex-col">
        {recentSongIds.map((id) => (
          <RecentRow key={id} songId={id} />
        ))}
      </div>
    </div>
  );
}

function RecentRow({ songId }: { songId: string }) {
  const dispatch = useAppDispatch();
  const song = useAppSelector((state: RootState) =>
    selectSongById(state, songId),
  );
  if (!song) return null;

  return (
    <button
      onClick={() => dispatch(setSong(songId))}
      className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/5"
    >
      <SongCover src={song.coverImage} alt={song.title} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{song.title}</p>
        <p className="truncate text-xs text-white/50">
          {song.artists.join(", ")}
        </p>
      </div>
    </button>
  );
}
