"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/globalHooks";
import PlaylistMosaicCover from "@/features/Playlist/playlistMosaicCover";
import { selectSongById } from "@/features/Songs/songsSlice";
import type { Playlist } from "@/types/playlist";
import type { RootState } from "@/store/store";
import { MoreHorizontal } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import BottomSheet from "../Common/BottomSheet";
import FolderPlaylistMoreOptions from "./FolderPlaylistMoreOptions";
import { useRef, useState } from "react";

export default function FolderPlaylistRow({
  playlist,
}: {
  playlist: Playlist;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const songCovers = useAppSelector((state: RootState) =>
    playlist.songs
      .slice(0, 4)
      .map((s) => selectSongById(state, s.songId)?.coverImage),
  );
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center gap-4 px-3 py-3 rounded-xl transition-colors duration-150"
      style={{ background: hovered ? "rgba(255,255,255,0.05)" : "transparent" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Nav button */}
      <button
        onClick={() => router.push(`/playlist/${playlist.id}`)}
        className="flex items-center gap-4 flex-1 min-w-0 text-left"
      >
        <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden">
          <PlaylistMosaicCover
            coverImage={playlist.coverImage}
            songCovers={songCovers}
            title={playlist.title}
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <p
            className={`text-sm font-semibold truncate transition-colors text-white`}
          >
            {playlist.title}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Playlist • {playlist.songs.length}{" "}
            {playlist.songs.length === 1 ? "song" : "songs"}
          </p>
        </div>
      </button>

      {/* More options */}
      <div
        className="relative shrink-0"
        onMouseEnter={(e) => e.stopPropagation()} // stop re-triggering parent
      >
        <button
          onClick={() => setMoreOpen((v) => !v)}
          ref={anchorRef}
          aria-label="More options"
          className={`transition-colors duration-150 max-md:opacity-100${
            hovered ? "text-white/60 hover:text-white opacity-100" : "opacity-0"
          }`}
        >
          <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* dropdown/sheet unchanged */}

        {isMobile ? (
          <BottomSheet
            isOpen={moreOpen}
            onClose={() => setMoreOpen(false)}
            title={playlist.title}
          >
            <FolderPlaylistMoreOptions
              playlistId={playlist.id}
              currentFolderId={playlist.folderId}
              onClose={() => setMoreOpen(false)}
              variant="sheet"
              anchorRef={anchorRef}
            />
          </BottomSheet>
        ) : (
          moreOpen && (
            <FolderPlaylistMoreOptions
              playlistId={playlist.id}
              currentFolderId={playlist.folderId}
              onClose={() => setMoreOpen(false)}
              variant="dropdown"
              anchorRef={anchorRef}
            />
          )
        )}
      </div>
    </div>
  );
}
