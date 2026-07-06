"use client";

import { useRef, useState } from "react";
import { MoreHorizontal, Pencil, Plus } from "lucide-react";
import { useAppSelector } from "@/globalHooks";
import { selectFolderById } from "@/features/Folder/folderSlice";
import { useIsMobile } from "@/hooks/useIsMobile";
import FolderMoreOptions from "./FolderMoreOptions";
import BottomSheet from "@/features/Common/BottomSheet";
import type { RootState } from "@/store/store";

export default function FolderActions({
  folderId,
  onRename,
}: {
  folderId: string;
  onRename: () => void;
}) {
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);
  const folder = useAppSelector((state: RootState) =>
    selectFolderById(state, folderId),
  );
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="flex items-center gap-3 px-4 sm:px-8 py-4">
      {/* Rename */}
      <button
        onClick={onRename}
        className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Rename
      </button>

      {/* Add playlist — wired later */}
      <button className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors">
        <Plus className="w-4 h-4" />
        Add playlist
      </button>

      {/* More options */}
      <div className="relative">
        <button
          onClick={() => setMoreOpen((v) => !v)}
          ref={anchorRef}
          className="flex items-center justify-center w-9 h-9 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
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
              anchorRef={anchorRef}
            />
          </BottomSheet>
        ) : (
          moreOpen && (
            <FolderMoreOptions
              folderId={folderId}
              onClose={() => setMoreOpen(false)}
              onRename={onRename}
              variant="dropdown"
              anchorRef={anchorRef}
            />
          )
        )}
      </div>
    </div>
  );
}
