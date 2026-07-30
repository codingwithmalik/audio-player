"use client";

import { Pencil, Trash2, ListMusic, Plus } from "lucide-react";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import { useRouter } from "next/navigation";
import { removeFolder } from "@/features/Folder/folderSlice";
import {
  selectPlaylists,
  setPlaylistFolder,
} from "@/features/Playlist/playlistSlice";
import ConfirmDialog from "@/features/Common/ConfirmDialog";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { RootState } from "@/store/store";
import { useSession } from "next-auth/react";
import {
  useCreatePlaylistMutation,
  useGetPlaylistsQuery,
  useMovePlaylistMutation,
} from "../Playlist/playlistsApi";
import { toast } from "sonner";
import { useDeleteFolderMutation } from "./foldersApi";

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
  useGetPlaylistsQuery();
  const playlists = useAppSelector(selectPlaylists);
  const songsById = useAppSelector((state: RootState) => state.songs.entities);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [movePlaylist] = useMovePlaylistMutation();
  const [createPlaylistMutation] = useCreatePlaylistMutation();
  const [deleteFolder] = useDeleteFolderMutation();
  const handleAddToFolder = (playlistId: string) => {
    dispatch(setPlaylistFolder({ playlistId, folderId }));
    movePlaylist({ id: playlistId, folderId });
    onClose();
  };

  const handleCreatePlaylist = async () => {
    if (userId) {
      try {
        const playlist = await createPlaylistMutation({
          title: "New Playlist " + (playlists.length + 1),
        }).unwrap();
        handleAddToFolder(playlist.id);
      } catch {
        toast.error("Failed to create playlist");
      }
    }
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
            action: () => handleAddToFolder(p.id),
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
              deleteFolder(folderId);
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
