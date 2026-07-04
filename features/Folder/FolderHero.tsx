"use client";

import { FolderClosed } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { Folder } from "@/types/folder";

export default function FolderHero({
  folder,
  isRenaming,
  onRenameStart,
  onRenameConfirm,
  onRenameCancel,
}: {
  folder: Folder;
  isRenaming: boolean;
  onRenameStart: () => void;
  onRenameConfirm: (title: string) => void;
  onRenameCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(folder.title);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(folder.title);
  }, [folder.title]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onRenameConfirm(draft);
    if (e.key === "Escape") onRenameCancel();
  };
  const accentColor = "#1a0a2e"

  return (
    <div className="relative">
      <div
        className="relative w-full"
        style={{
          background: `linear-gradient(180deg, ${accentColor}CC 0%, ${accentColor}44 60%, transparent 100%)`,
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 px-4 sm:px-8 pt-10 pb-8 rounded-t-md">
        {/* Folder icon box */}
        <div className="shrink-0 w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <FolderClosed className="w-20 h-20 sm:w-24 sm:h-24 text-white/30" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-3 min-w-0 text-center sm:text-left pb-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Folder
          </p>

          {isRenaming ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => onRenameConfirm(draft)}
              className="text-3xl sm:text-5xl font-bold text-white bg-transparent border-b-2 border-purple-500 outline-none w-full max-w-md"
            />
          ) : (
            <h1
              onClick={onRenameStart}
              title="Click to rename"
              className="text-3xl sm:text-5xl font-bold text-white truncate cursor-pointer hover:text-white/80 transition-colors leading-tight"
            >
              {folder.title}
            </h1>
          )}

          <p className="text-sm text-zinc-400">
            {folder.playlistIds.length === 0
              ? "No playlists yet"
              : `${folder.playlistIds.length} ${folder.playlistIds.length === 1 ? "playlist" : "playlists"}`}
          </p>
        </div>
      </div>
    </div>
  );
}
