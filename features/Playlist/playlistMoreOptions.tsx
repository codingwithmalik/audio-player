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
  selectPlaylists,
  setPlaylistFolder,
  selectPlaylistById,
  addSongsToPlaylist,
} from "./playlistSlice";
import { useRouter } from "next/navigation";
import { selectFolders } from "@/features/Folder/folderSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { addManyToManualQueue } from "../RightSidebar/Queue/queueSlice";
import { RefObject } from "react";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import {
  useAddSongToPlaylistMutation,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useGetPlaylistsQuery,
  useMovePlaylistMutation,
} from "./playlistsApi";
import { toast } from "sonner";
import {
  useCreateFolderMutation,
  useGetFoldersQuery,
} from "../Folder/foldersApi";

export default function PlaylistMoreOptions({
  onEditDetails,
  currentFolderId,
  playlistId,
  onDownload,
  onClose,
  variant = "dropdown",
  anchorRef,
}: {
  playlistId: string;
  currentFolderId: string | null;
  onEditDetails: () => void;
  onDownload: () => void;
  onClose: () => void;
  variant?: "dropdown" | "sheet";
  anchorRef?: RefObject<HTMLButtonElement | null>;
}) {
  const [movePlaylist] = useMovePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [addSongsMutation] = useAddSongToPlaylistMutation();
  const [createPlaylistMutation] = useCreatePlaylistMutation();
  const [createFolder] = useCreateFolderMutation();
  useGetPlaylistsQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  useGetFoldersQuery();
  const folders = useAppSelector(selectFolders);
  const songsById = useAppSelector((state: RootState) => state.songs.entities);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const sourcePlaylist = useAppSelector((state) =>
    selectPlaylistById(state, playlistId),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemoveFromFolder = () => {
    dispatch(setPlaylistFolder({ playlistId, folderId: null }));
    movePlaylist({ id: playlistId, folderId: null });
  };

  const handleAddToFolder = (folderId: string) => {
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    movePlaylist({ id: playlistId, folderId });
    onClose();
  };

  const handleCreateFolder = async () => {
    if (userId) {
      try {
        const folder = await createFolder({
          title: "New Folder " + (folders.length + 1),
        }).unwrap();
        handleAddToFolder(folder.id);
      } catch {
        toast.error("Failed to create folder");
      }
    }
  };

  const handleAddToPlaylist = (targetPlaylistId: string) => {
    if (!sourcePlaylist) return;
    const songIds = sourcePlaylist.songs.map((s) => s.songId);
    dispatch(
      addSongsToPlaylist({ targetPlaylistId, songs: sourcePlaylist.songs }),
    );
    addSongsMutation({ playlistId: targetPlaylistId, songIds });
    onClose();
  };

  const handleCreatePlaylist = async () => {
    if (userId) {
      try {
        const playlist = await createPlaylistMutation({
          title: "New Playlist " + (playlists.length + 1),
        }).unwrap();
        handleAddToPlaylist(playlist.id);
      } catch {
        toast.error("Failed to create playlist");
      }
    }
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
          addManyToManualQueue(sourcePlaylist.songs.map((s) => s.songId)),
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
          .filter((p) => p.id !== playlistId && !p.id.startsWith("liked-"))
          .map((p) => ({
            id: p.id,
            label: p.title,
            action: () => handleAddToPlaylist(p.id),
            cover: {
              coverImage: p.coverImage,
              songCovers: p.songs
                .slice(0, 4)
                .map((s) => songsById[s.songId]?.coverImage),
              isLikedPlaylist: false, // already filtered out above, but explicit for clarity
            },
          })),
      ],
    },
  ];

  return (
    <>
      <MoreOptions
        anchorRef={anchorRef}
        placement="top-start"
        options={options}
        variant={variant}
        onClose={onClose}
        confirmDialog={
          confirmOpen && (
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
                  <span className="font-semibold text-white">Your Library</span>
                  .
                </>
              }
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={() => {
                deletePlaylist(playlistId);
                handleRemoveFromFolder();
                setConfirmOpen(false);
                router.push("/");
              }}
              onCancel={() => setConfirmOpen(false)}
            />
          )
        }
      />
    </>
  );
}
