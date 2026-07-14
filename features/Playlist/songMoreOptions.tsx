"use client";

import { ListPlus, ListMusic, Heart, Trash2, Link, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  addPlaylist,
  selectLikedPlaylistId,
  selectIsLiked,
} from "@/features/Playlist/playlistSlice";
import { addToManualQueue, } from "@/features/RightSidebar/Queue/queueSlice";
import type { RootState } from "@/store/store";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { RefObject } from "react";

export default function SongMoreOptions({
  songId,
  playlistId,
  onClose,
  variant = "dropdown",
  anchorRef,
}: {
  songId: string;
  playlistId: string | null;
  onClose: () => void;
  variant?: "dropdown" | "sheet";
  anchorRef: RefObject<HTMLButtonElement | null>;
}) {
  const dispatch = useAppDispatch();
  const playlists = useAppSelector(selectPlaylists);
  const likedPlaylistId = useAppSelector(selectLikedPlaylistId);
  const isLiked = useAppSelector((state: RootState) =>
    selectIsLiked(state, songId),
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? "local");

  const currentPlaylist = useAppSelector((state: RootState) =>
    playlistId ? state.playlists.entities[playlistId] : null,
  );
  const isInPlaylist = playlistId
    ? currentPlaylist?.songs.some((s) => s.songId === songId)
    : false;

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAddToPlaylist = (targetPlaylistId: string) => {
    dispatch(addSongToPlaylist({ playlistId: targetPlaylistId, songId }));
    onClose();
  };

  const handleCreatePlaylist = () => {
    const newPlaylistId = crypto.randomUUID();
    dispatch(
      addPlaylist({
        title: "New Playlist " + (playlists.length + 1),
        ownerId: userId,
      }),
    );
    handleAddToPlaylist(newPlaylistId);
  };

  // ── Options ───────────────────────────────────────────────────────────────
  const options: MoreOption[] = [
    {
      id: "add-playlist",
      label: "Add to playlist",
      icon: ListMusic,
      submenuPlaceholder: "Find a playlist",
      submenuPosition: "left",
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
          })),
      ],
    },
    ...(isInPlaylist
      ? [
          {
            id: "remove-playlist",
            label: "Remove from this playlist",
            icon: Trash2,
            action: () => {
              if (!playlistId) return;
              dispatch(removeSongFromPlaylist({ playlistId, songId }));
              onClose();
            },
          } as MoreOption,
        ]
      : []),
    {
      id: "like",
      label: isLiked ? "Remove from Liked Songs" : "Save to Liked Songs",
      icon: Heart,
      iconFilled: isLiked,
      separatorAbove: true,
      action: () => {
        if (!likedPlaylistId) return;
        if (isLiked) {
          dispatch(
            removeSongFromPlaylist({ playlistId: likedPlaylistId, songId }),
          );
        } else {
          dispatch(addSongToPlaylist({ playlistId: likedPlaylistId, songId }));
        }
        onClose();
      },
    },
    {
      id: "queue",
      label: "Add to queue",
      icon: ListPlus,
      action: () => {
        dispatch(addToManualQueue(songId));
        onClose();
      },
    },
    {
      id: "copy-link",
      label: "Copy song link",
      icon: Link,
      separatorAbove: true,
      action: () => {
        navigator.clipboard.writeText(
          `${window.location.origin}/songs/${songId}`,
        );
        onClose();
      },
    },
  ];

  return (
    <MoreOptions
      options={options}
      variant={variant}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="top-end"
    />
  );
}
