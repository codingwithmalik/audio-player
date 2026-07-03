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

  // Focus input when rename starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Keep draft in sync if title changes externally
  useEffect(() => {
    setDraft(folder.title);
  }, [folder.title]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onRenameConfirm(draft);
    if (e.key === "Escape") onRenameCancel();
  };

  return (
    <div className="flex items-end gap-6 px-6 pt-10 pb-6">
      {/* Folder icon — fixed size, no cover image */}
      <div className="shrink-0 w-44 h-44 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
        <FolderClosed className="w-20 h-20 text-white/40" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 min-w-0 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Folder
        </p>

        {/* Inline rename or title display */}
        {isRenaming ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => onRenameConfirm(draft)}
            className="text-4xl font-bold text-white bg-transparent border-b border-purple-500 outline-none w-full max-w-md"
          />
        ) : (
          <h1
            onClick={onRenameStart}
            className="text-4xl font-bold text-white truncate cursor-pointer hover:text-white/80 transition-colors"
            title="Click to rename"
          >
            {folder.title}
          </h1>
        )}

        <p className="text-sm text-zinc-400">
          {folder.playlistIds.length}{" "}
          {folder.playlistIds.length === 1 ? "playlist" : "playlists"}
        </p>
      </div>
    </div>
  );
}