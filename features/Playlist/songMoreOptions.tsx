"use client";

import { ListPlus, ListMusic, Heart, Trash2, Link, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/globalHooks";
import {
  selectPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  selectLikedPlaylistId,
  selectIsLiked,
} from "@/features/Playlist/playlistSlice";
import { addToManualQueue } from "@/features/RightSidebar/Queue/queueSlice";
import type { RootState } from "@/store/store";
import MoreOptions, { MoreOption } from "@/features/Common/MoreOptions";
import { RefObject } from "react";
import { useSession } from "next-auth/react";
import {
  useAddSongToPlaylistMutation,
  useCreatePlaylistMutation,
  useGetPlaylistsQuery,
  useRemoveSongFromPlaylistMutation,
} from "@/features/Playlist/playlistsApi";
import { toast } from "sonner";
import { selectSongById } from "../Songs/songsSlice";

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
  const { data: session } = useSession();
  const userId = session?.user.id;
  //new playlist api mutations
  const [addSongMutation] = useAddSongToPlaylistMutation();
  const [removeSongMutation] = useRemoveSongFromPlaylistMutation();
  const [createPlaylistMutation] = useCreatePlaylistMutation();

  const dispatch = useAppDispatch();
  useGetPlaylistsQuery()
  const playlists = useAppSelector(selectPlaylists);
  const likedPlaylistId = useAppSelector((state: RootState) =>
    selectLikedPlaylistId(state, userId ?? "local"),
  );
  const songsById = useAppSelector((state: RootState) => state.songs.entities);
  const song = useAppSelector((state: RootState) =>
    selectSongById(state, songId),
  );
  const isLiked = useAppSelector((state: RootState) =>
    selectIsLiked(state, songId, userId ?? "local"),
  );
  const currentPlaylist = useAppSelector((state: RootState) =>
    playlistId ? state.playlists.entities[playlistId] : null,
  );
  const isInPlaylist = playlistId
    ? currentPlaylist?.songs.some((s) => s.songId === songId)
    : false;

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleAddToPlaylist = (targetPlaylistId: string) => {
    dispatch(addSongToPlaylist({ playlistId: targetPlaylistId, songId }));
    addSongMutation({ playlistId: targetPlaylistId, songIds:[songId] });
    onClose();
  };

  const handleCreatePlaylist = async () => {
    if (userId)
      try {
        const playlist = await createPlaylistMutation({
          title: song?.title ?? "New Playlist " + playlists.length + 1,
          coverImage: song?.coverImage,
        }).unwrap();
        handleAddToPlaylist(playlist.id);
      } catch (err) {
        toast.error("Failed to create playlist");
      }
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
    ...(isInPlaylist
      ? [
          {
            id: "remove-playlist",
            label: "Remove from this playlist",
            icon: Trash2,
            action: () => {
              if (!playlistId) return;
              dispatch(removeSongFromPlaylist({ playlistId, songId }));
              removeSongMutation({ playlistId, songId });
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
          removeSongMutation({ playlistId: likedPlaylistId, songId });
        } else {
          dispatch(addSongToPlaylist({ playlistId: likedPlaylistId, songId }));
          addSongMutation({ playlistId: likedPlaylistId, songIds:[songId] });
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
