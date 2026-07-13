import { createListenerMiddleware } from "@reduxjs/toolkit";
import { removePlaylist, setPlaylistFolder } from "@/features/Playlist/playlistSlice";
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
