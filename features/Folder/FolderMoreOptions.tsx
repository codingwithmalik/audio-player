"use client";

import { Pencil, Trash2, ListMusic, Plus } from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { useRouter } from "next/navigation";
import {
  removeFolder,
  removePlaylistFromFolder,
} from "@/features/Folder/folderSlice";
import {
  selectPlaylists,
  addPlaylist,
  setPlaylistFolder,
} from "@/features/Playlist/playlistSlice";
import { addPlaylistToFolder } from "@/features/Folder/folderSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";

export default function FolderMoreOptions({
  folderId,
  onClose,
  onRename,
  variant = "dropdown",
  anchorRef,
}: {
  folderId: string;
  onClose: () => void;
  onRename: () => void;
  variant?: "dropdown" | "sheet";
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");
  const now = new Date().toISOString();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleAddToFolder = (
    playlistId: string,
    currentFolderId: string | null,
  ) => {
    if (currentFolderId) {
      dispatch(
        removePlaylistFromFolder({ folderId: currentFolderId, playlistId }),
      );
    }
    dispatch(addPlaylistToFolder({ folderId, playlistId }));
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    onClose();
  };

  const handleCreatePlaylist = () => {
    const newPlaylistId = crypto.randomUUID();
    dispatch(
      addPlaylist({
        id: newPlaylistId,
        type: "playlist",
        title: "New Playlist " + (playlists.length + 1),
        description: "",
        coverImage: "",
        songs: [],
        folderId,
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    dispatch(addPlaylistToFolder({ folderId, playlistId: newPlaylistId }));
    onClose();
  };

  const options: MoreOption[] = [
    {
      id: "rename",
      label: "Rename",
      icon: Pencil,
      action: () => {
        onRename();
        onClose();
      },
    },
    {
      id: "add-playlist",
      label: "Add playlist to folder",
      icon: ListMusic,
      submenuPlaceholder: "Find a playlist",
      submenuPosition: "right",
      submenu: [
        { id: "search", searchable: true },
        {
          id: "new-playlist",
          label: "New Playlist",
          icon: Plus,
          action: handleCreatePlaylist,
          separatorAbove: true,
        },
        ...playlists
          .filter((p) => p.folderId !== folderId && !p.id.startsWith("liked-"))
          .map((p) => ({
            id: p.id,
            label: p.title,
            action: () => handleAddToFolder(p.id, p.folderId),
          })),
      ],
    },
    {
      id: "delete",
      label: "Delete Folder",
      icon: Trash2,
      separatorAbove: true,
      action: () => setConfirmOpen(true),
    },
  ];

  return (
    <MoreOptions
      placement="right-start"
      anchorRef={anchorRef}
      options={options}
      variant={variant}
      onClose={onClose}
      confirmDialog={
        confirmOpen && (
          <ConfirmDialog
            open={confirmOpen}
            title="Delete Folder?"
            description={
              <span>
                This will delete the folder.{" "}
                <span className="font-semibold text-white">
                  Playlists inside will not be deleted.
                </span>
              </span>
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => {
              dispatch(removeFolder(folderId));
              setConfirmOpen(false);
              router.push("/");
              console.log("Folder deleted, navigate to home");
            }}
            onCancel={() => setConfirmOpen(false)}
          />
        )
      }
    />
  );
}
