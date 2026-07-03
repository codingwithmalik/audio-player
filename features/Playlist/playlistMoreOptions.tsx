"use client";

import {
  Download,
  ListPlus,
  Pencil,
  Trash2,
  Plus,
  FolderClosed,
  ListMusic,
  FolderMinus,
} from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  removePlaylist,
  selectPlaylists,
  addPlaylist,
  setPlaylistFolder,
  selectPlaylistById,
  addSongsToPlaylist,
} from "./playlistSlice";
import { useRouter } from "next/navigation";
import {
  addFolder,
  addPlaylistToFolder,
  removePlaylistFromFolder,
  selectFolders,
} from "@/features/Folder/folderSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { setQueue } from "../RightSidebar/Queue/queueSlice";

export default function PlaylistMoreOptions({
  onEditDetails,
  currentFolderId,
  playlistId,
  onDownload,
  onClose,
  variant = "dropdown",
}: {
  playlistId: string;
  currentFolderId: string | null;
  onEditDetails: () => void;
  onDownload: () => void;
  onClose: () => void;
  variant?: "dropdown" | "sheet";
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const folders = useAppSelector(selectFolders);
  const now = new Date().toISOString();
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");
  const sourcePlaylist = useAppSelector((state) =>
    selectPlaylistById(state, playlistId),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemoveFromFolder = () => {
    if (!currentFolderId) return;
    dispatch(
      removePlaylistFromFolder({ folderId: currentFolderId, playlistId }),
    );
    dispatch(setPlaylistFolder({ playlistId, folderId: null }));
  };

  const handleAddToFolder = (folderId: string) => {
    if (currentFolderId) handleRemoveFromFolder();
    dispatch(addPlaylistToFolder({ folderId, playlistId }));
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    onClose();
  };

  const handleCreateFolder = () => {
    const newFolderId = crypto.randomUUID();
    dispatch(
      addFolder({
        id: newFolderId,
        type: "folder",
        title: "New Folder " + (folders.length + 1),
        playlistIds: [],
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    handleAddToFolder(newFolderId);
  };

  const handleAddToPlaylist = (targetPlaylistId: string) => {
    if (!sourcePlaylist) return;
    dispatch(
      addSongsToPlaylist({ targetPlaylistId, songs: sourcePlaylist.songs }),
    );
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
        folderId: null,
        ownerId: userId,
        createdAt: now,
        updatedAt: now,
      }),
    );
    handleAddToPlaylist(newPlaylistId);
  };

  // ── Options ───────────────────────────────────────────────────────────────
  const options: MoreOption[] = [
    {
      id: "queue",
      label: "Add to queue",
      icon: ListPlus,
      action: () => {
        console.log("Add to Queue");
        dispatch(
          setQueue({
            songIds: sourcePlaylist.songs.map((s) => s.songId),
            sourceType: "playlist",
            sourceId: playlistId,
          }),
        );
        onClose();
      },
    },
    {
      id: "download",
      label: "Download",
      icon: Download,
      action: () => {
        onDownload();
        onClose();
      },
    },
    {
      id: "edit",
      label: "Edit Details",
      icon: Pencil,
      action: () => {
        onEditDetails();
        onClose();
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      action: () => setConfirmOpen(true),
    },
    {
      id: "move-folder",
      label: "Move to folder",
      icon: FolderClosed,
      submenuPlaceholder: "Find a folder",
      submenuPosition: "right",
      submenu: [
        { id: "search", searchable: true },
        {
          id: "new-folder",
          label: "New Folder",
          icon: Plus,
          action: handleCreateFolder,
          separatorAbove: true,
        },
        ...(currentFolderId
          ? [
              {
                id: "remove-folder",
                label: "Remove from Folder",
                icon: FolderMinus,
                action: () => {
                  handleRemoveFromFolder();
                  onClose();
                },
                separatorAbove: true,
              },
            ]
          : []),
        ...folders.map((f) => ({
          id: f.id,
          label: f.title,
          action: () => handleAddToFolder(f.id),
        })),
      ],
    },
    {
      id: "add-playlist",
      label: "Add to other playlist",
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
          .filter((p) => p.id !== playlistId)
          .map((p) => ({
            id: p.id,
            label: p.title,
            action: () => handleAddToPlaylist(p.id),
          })),
      ],
    },
  ];

  return (
    <>
      <MoreOptions
        options={options}
        variant={variant}
        onClose={onClose}
        confirmDialog={
          <ConfirmDialog
            open={confirmOpen}
            title="Delete from Your Library?"
            description={
              <>
                This will delete{" "}
                <span className="font-semibold text-white">
                  {sourcePlaylist?.title}
                </span>{" "}
                from{" "}
                <span className="font-semibold text-white">Your Library</span>.
              </>
            }
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => {
              dispatch(removePlaylist(playlistId));
              handleRemoveFromFolder();
              setConfirmOpen(false);
              router.push("/");
            }}
            onCancel={() => setConfirmOpen(false)}
          />
        }
      />
    </>
  );
}
