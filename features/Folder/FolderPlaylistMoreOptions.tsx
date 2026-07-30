"use client";

import { FolderClosed, FolderMinus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/globalHooks";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { selectFolders } from "@/features/Folder/folderSlice";
import {
  setPlaylistFolder,
  softDeletePlaylist,
} from "@/features/Playlist/playlistSlice";
import { useSession } from "next-auth/react";
import {
  useDeletePlaylistMutation,
  useMovePlaylistMutation,
} from "../Playlist/playlistsApi";
import { toast } from "sonner";
import { useCreateFolderMutation, useGetFoldersQuery } from "./foldersApi";

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
  const [movePlaylist] = useMovePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [createFolder] = useCreateFolderMutation();

  useGetFoldersQuery();
  const folders = useAppSelector(selectFolders);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemoveFromFolder = () => {
    dispatch(setPlaylistFolder({ playlistId, folderId: null }));
    movePlaylist({ id: playlistId, folderId: null });
    onClose();
  };

  const handleMoveToFolder = (folderId: string) => {
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    movePlaylist({ id: playlistId, folderId });
    onClose();
  };

  const handleCreateFolder = async () => {
    if (userId)
      try {
        const folder = await createFolder({
          title: "New Folder " + (folders.length + 1),
        }).unwrap();
        handleMoveToFolder(folder.id);
      } catch  {
        toast.error("Failed to create folder");
      }
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
              dispatch(softDeletePlaylist(playlistId));
              deletePlaylist(playlistId);
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
