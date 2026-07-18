"use client";

import { useRef } from "react";
import { FolderOpen, FileAudio, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import { upsertSongs } from "@/features/Songs/songsSlice"; // adjust action name if different
import {
  addLocalFileIds,
  selectLocalFileIds,
  selectIsParsingLocalFiles,
  setParsing,
} from "./localFilesSlice";
import {
  setQueue,
  setCurrentIndex,
} from "@/features/RightSidebar/Queue/queueSlice";
import { setSong, setPlaying } from "@/store/playerSlice";
import { parseLocalFile } from "./parseLocalFile";
import SongCover from "@/features/Common/SongCover";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export default function LocalFilesSection({ onBack }: { onBack?: () => void }) {
  const dispatch = useAppDispatch();
  const songIds = useAppSelector(selectLocalFileIds);
  const isParsing = useAppSelector(selectIsParsingLocalFiles);
  const songs = useAppSelector((state) =>
    songIds.map((id) => state.songs.entities[id]).filter(Boolean),
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");

  const filesInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  async function handleFilesPicked(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const audioFiles = Array.from(fileList).filter((f) =>
      f.type.startsWith("audio/"),
    );
    if (audioFiles.length === 0) return;

    dispatch(setParsing(true));
    const parsed = await Promise.all(
      audioFiles.map((file) => parseLocalFile(file, userId)),
    );
    dispatch(upsertSongs(parsed));
    dispatch(addLocalFileIds(parsed.map((s) => s.id)));
    dispatch(setParsing(false));
  }
  // add inside the component, alongside the other hooks:
  function handlePlaySong(songId: string) {
    const index = songIds.indexOf(songId);
    dispatch(setQueue({ songIds, sourceType: "home", sourceId: null }));
    dispatch(setCurrentIndex(index));
    dispatch(setSong(songId));
    dispatch(setPlaying(true));
  }
  return (
    <OverlayScrollbarsComponent defer className="bg-inherit w-full h-full">
      <div className="flex items-center gap-3 px-1  pt-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Back to library"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h2 className="text-md font-bold text-white">Local Files</h2>
      </div>

      <div className="flex flex-col gap-4 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => filesInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            <FileAudio className="w-4 h-4" /> Choose files
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold"
          >
            <FolderOpen className="w-4 h-4" /> Choose folder
          </button>
        </div>

        <input
          ref={filesInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesPicked(e.target.files)}
        />
        {/* webkitdirectory is non-standard (Chromium/Firefox only) — not in React's typed attrs */}
        <input
          ref={folderInputRef}
          type="file"
          multiple
          // @ts-expect-error -- webkitdirectory isn't a typed HTML attribute
          webkitdirectory=""
          className="hidden"
          onChange={(e) => handleFilesPicked(e.target.files)}
        />

        {isParsing && <p className="text-xs text-white/50">Reading files…</p>}

        {songs.length === 0 && !isParsing && (
          <p className="text-sm text-white/50">
            No local files added yet. Choose files or a folder from your device.
          </p>
        )}

        <div className="flex flex-col gap-1">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => handlePlaySong(song.id)}
              className="flex items-center gap-3 p-2 rounded hover:bg-white/5"
            >
              <SongCover src={song.coverImage} alt={song.title} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{song.title}</p>
                <p className="text-xs text-white/50 truncate">
                  {song.artists.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OverlayScrollbarsComponent>
  );
}
