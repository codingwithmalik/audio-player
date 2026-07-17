import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  removePlaylist,
  setPlaylistFolder,
  softDeletePlaylist,
  restorePlaylist,
} from "@/features/Playlist/playlistSlice";
import {
  addPlaylistToFolder,
  removePlaylistFromFolder,
} from "@/features/Folder/folderSlice";
import type { RootState } from "@/store/store";

export const folderSyncMiddleware = createListenerMiddleware();

folderSyncMiddleware.startListening({
  actionCreator: setPlaylistFolder,
  effect: (action, listenerApi) => {
    const { playlistId, folderId: newFolderId } = action.payload;
    const prevState = listenerApi.getOriginalState() as RootState;
    const oldFolderId =
      prevState.playlists.entities[playlistId]?.folderId ?? null;

    if (oldFolderId === newFolderId) return;

    if (oldFolderId) {
      listenerApi.dispatch(
        removePlaylistFromFolder({ folderId: oldFolderId, playlistId }),
      );
    }
    if (newFolderId) {
      listenerApi.dispatch(
        addPlaylistToFolder({ folderId: newFolderId, playlistId }),
      );
    }
  },
});
folderSyncMiddleware.startListening({
  actionCreator: removePlaylist,
  effect: (action, listenerApi) => {
    const playlistId = action.payload;
    const prevState = listenerApi.getOriginalState() as RootState;
    const oldFolderId = prevState.playlists.entities[playlistId]?.folderId;

    if (oldFolderId) {
      listenerApi.dispatch(
        removePlaylistFromFolder({ folderId: oldFolderId, playlistId }),
      );
    }
  },
});
// ── Trash sync ──
// Soft-deleting hides the playlist from its folder (so it disappears from
// library nav) without touching folderId — restoring later puts it right
// back where it came from, no snapshot needed.

folderSyncMiddleware.startListening({
  actionCreator: softDeletePlaylist,
  effect: (action, listenerApi) => {
    const playlistId = action.payload;
    const prevState = listenerApi.getOriginalState() as RootState;
    const folderId = prevState.playlists.entities[playlistId]?.folderId;

    if (folderId) {
      listenerApi.dispatch(removePlaylistFromFolder({ folderId, playlistId }));
    }
  },
});

folderSyncMiddleware.startListening({
  actionCreator: restorePlaylist,
  effect: (action, listenerApi) => {
    const playlistId = action.payload;
    // Use the CURRENT state here, not getOriginalState() — folderId was
    // never cleared during soft-delete, so it's still sitting on the
    // playlist entity right now.
    const currentState = listenerApi.getState() as RootState;
    const folderId = currentState.playlists.entities[playlistId]?.folderId;

    if (folderId) {
      listenerApi.dispatch(addPlaylistToFolder({ folderId, playlistId }));
    }
  },
});
