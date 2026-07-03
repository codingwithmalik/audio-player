"use client";

import { useState } from "react";
import { Play, Shuffle, MoreHorizontal } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { setQueue } from "@/features/RightSidebar/Queue/queueSlice";
import { selectFolderById } from "@/features/Folder/folderSlice";
import { selectPlaylistById } from "@/features/Playlist/playlistSlice";
import { useIsMobile } from "@/hooks/useIsMobile";
import FolderMoreOptions from "./FolderMoreOptions";
import BottomSheet from "@/features/Common/BottomSheet";
import type { RootState } from "@/store/store";

export default function FolderActions({
  folderId,
  onRename,
  playlistCount,
}: {
  folderId: string;
  onRename: () => void;
  playlistCount: number;
}) {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  const folder = useAppSelector((state: RootState) =>
    selectFolderById(state, folderId)
  );

  // Collect all song IDs across all playlists in folder
  const allSongIds = useAppSelector((state: RootState) =>
    (folder?.playlistIds ?? []).flatMap((pid) => {
      const playlist = selectPlaylistById(state, pid);
      return playlist?.songs.map((s) => s.songId) ?? [];
    })
  );

  const handlePlay = () => {
    if (!allSongIds.length) return;
    dispatch(setQueue({ songIds: allSongIds, sourceType: "playlist", sourceId: folderId }));
  };

  const handleShuffle = () => {
    if (!allSongIds.length) return;
    const shuffled = [...allSongIds].sort(() => Math.random() - 0.5);
    dispatch(setQueue({ songIds: shuffled, sourceType: "playlist", sourceId: folderId }));
  };

  return (
    <div className="flex items-center gap-3 px-6 py-4">
      {/* Play */}
      <button
        onClick={handlePlay}
        disabled={!playlistCount}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 hover:scale-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
      >
        <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
      </button>

      {/* Shuffle */}
      <button
        onClick={handleShuffle}
        disabled={!playlistCount}
        className="flex items-center justify-center w-11 h-11 rounded-full text-white/60 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Shuffle className="w-5 h-5" />
      </button>

      {/* More options */}
      <div className="relative ml-1">
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="flex items-center justify-center w-11 h-11 rounded-full text-white/60 hover:text-white transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {isMobile ? (
          <BottomSheet
            isOpen={moreOpen}
            onClose={() => setMoreOpen(false)}
            title={folder?.title}
          >
            <FolderMoreOptions
              folderId={folderId}
              onClose={() => setMoreOpen(false)}
              onRename={onRename}
              variant="sheet"
            />
          </BottomSheet>
        ) : (
          moreOpen && (
            <div className="absolute left-0 top-full mt-2 w-60 bg-[#1a0a2e] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
              <FolderMoreOptions
                folderId={folderId}
                onClose={() => setMoreOpen(false)}
                onRename={onRename}
                variant="dropdown"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}