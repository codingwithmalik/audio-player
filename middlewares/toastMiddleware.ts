import { createListenerMiddleware } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { RootState } from "@/store/store";
import {
  addPlaylist,
  softDeletePlaylist,
  restorePlaylist,
  removePlaylist,
  addSongToPlaylist,
  addSongsToPlaylist,
  removeSongFromPlaylist,
  updatePlaylistMeta,
} from "@/features/Playlist/playlistSlice";
import { addFolder, removeFolder } from "@/features/Folder/folderSlice";
import { setPersonalInfo } from "@/features/Profile/accountSlice";

export const toastMiddleware = createListenerMiddleware();

toastMiddleware.startListening({
  actionCreator: addPlaylist,
  effect: (action) => {
    toast.success(`Created "${action.payload.title}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: softDeletePlaylist,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const playlist = state.playlists.entities[action.payload];
    toast(`Moved "${playlist?.title ?? "playlist"}" to trash`);
  },
});

toastMiddleware.startListening({
  actionCreator: restorePlaylist,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const playlist = state.playlists.entities[action.payload];
    toast.success(`Restored "${playlist?.title ?? "playlist"}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: removePlaylist,
  effect: (action, listenerApi) => {
    // Entity is gone by the time this fires — need the state from before the delete.
    const prevState = listenerApi.getOriginalState() as RootState;
    const playlist = prevState.playlists.entities[action.payload];
    toast(`Deleted "${playlist?.title ?? "playlist"}" forever`);
  },
});

toastMiddleware.startListening({
  actionCreator: addSongToPlaylist,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const playlist = state.playlists.entities[action.payload.playlistId];
    toast.success(`Added to "${playlist?.title ?? "playlist"}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: addSongsToPlaylist,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const playlist = state.playlists.entities[action.payload.targetPlaylistId];
    const count = action.payload.songs.length;
    toast.success(
      `Added ${count} song${count === 1 ? "" : "s"} to "${playlist?.title ?? "playlist"}"`,
    );
  },
});

toastMiddleware.startListening({
  actionCreator: removeSongFromPlaylist,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const playlist = state.playlists.entities[action.payload.playlistId];
    toast(`Removed from "${playlist?.title ?? "playlist"}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: updatePlaylistMeta,
  effect: (action) => {
    if (action.payload.title) toast.success("Playlist updated");
  },
});

toastMiddleware.startListening({
  actionCreator: addFolder,
  effect: (action) => {
    toast.success(`Created folder "${action.payload.title}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: removeFolder,
  effect: (action, listenerApi) => {
    const prevState = listenerApi.getOriginalState() as RootState;
    const folder = prevState.folders.entities[action.payload];
    toast(`Deleted folder "${folder?.title ?? ""}"`);
  },
});

toastMiddleware.startListening({
  actionCreator: setPersonalInfo,
  effect: () => {
    toast.success("Profile updated");
  },
});
