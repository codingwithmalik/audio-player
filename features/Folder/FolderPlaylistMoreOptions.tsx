"use client";

import { FolderClosed, FolderMinus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { selectFolders, addFolder } from "@/features/Folder/folderSlice";
import {
  removePlaylist,
  setPlaylistFolder,
} from "@/features/Playlist/playlistSlice";

export default function FolderPlaylistMoreOptions({
  playlistId,
  currentFolderId,
  onClose,
  variant = "dropdown",
  anchorRef,
}: {
  playlistId: string;
  currentFolderId?: string | null;
  onClose: () => void;
  variant?: "dropdown" | "sheet";
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const dispatch = useAppDispatch();
  // const router = useRouter();
  const folders = useAppSelector(selectFolders);
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemoveFromFolder = () => {
    dispatch(setPlaylistFolder({ playlistId, folderId: null }));
    onClose();
  };

  const handleMoveToFolder = (folderId: string) => {
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    onClose();
  };

  const handleCreateFolder = () => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    dispatch(
      addFolder({
        id,
        type: "folder",
        title: `New Folder ${folders.length + 1}`,
        playlistIds: [playlistId],
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    dispatch(setPlaylistFolder({ playlistId, folderId: id }));
    onClose();
  };

  // ── Options ───────────────────────────────────────────────────────────────
  const options: MoreOption[] = [
    // Remove from this folder — only shown when in a folder
    ...(currentFolderId
      ? [
          {
            id: "remove-folder",
            label: "Remove from folder",
            icon: FolderMinus,
            action: handleRemoveFromFolder,
          } as MoreOption,
        ]
      : []),

    {
      id: "move",
      label: "Move to folder",
      icon: FolderClosed,
      submenuPosition: "left" as const,
      submenuPlaceholder: "Find a folder",
      submenu: [
        { id: "search", searchable: true },
        {
          id: "new-folder",
          label: "New Folder",
          icon: Plus,
          action: handleCreateFolder,
          separatorAbove: true,
        },
        ...folders
          .filter((f) => f.id !== currentFolderId)
          .map((f) => ({
            id: f.id,
            label: f.title,
            action: () => handleMoveToFolder(f.id),
          })),
      ],
    },

    {
      id: "delete",
      label: "Delete Playlist",
      icon: Trash2,
      separatorAbove: true,
      action: () => setConfirmOpen(true),
    },
  ];

  return (
    <MoreOptions
      options={options}
      variant={variant}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="top-start"
      confirmDialog={
        confirmOpen && (
          <ConfirmDialog
            open={confirmOpen}
            title="Delete Playlist?"
            description="This playlist will be permanently deleted."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => {
              dispatch(removePlaylist(playlistId));
              setConfirmOpen(false);
              onClose();
              // No router.push — stay on folder page, list updates automatically
            }}
            onCancel={() => setConfirmOpen(false)}
          />
        )
      }
    />
  );
}
