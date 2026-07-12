"use client";

import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { selectRecentSongIds } from "@/slices/historySlice";
import { selectSongById } from "@/features/Songs/songsSlice";
import { setSong } from "@/store/playerSlice";
import type { RootState } from "@/store/store";
import SongCover from "@/features/Common/SongCover";

export default function RecentlyPlayed() {
  const recentSongIds = useAppSelector(selectRecentSongIds);

  if (recentSongIds.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-white/40">
        No recently played songs yet
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
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
