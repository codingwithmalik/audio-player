import { configureStore } from "@reduxjs/toolkit";
import { historyListenerMiddleware } from "@/middlewares/historyMiddleware";
import { folderSyncMiddleware } from "@/middlewares/folderSyncMiddleware";
import { playTrackingMiddleware } from "@/middlewares/playCountMiddleware";
import authslice from "@/features/Auth/authSlice";
import librarySlice from "@/features/LeftSidebar/Library/libraryslice";
import playerSlice from "@/store/playerSlice";
import playlistSlice from "@/features/Playlist/playlistSlice";
import foldersSlice from "@/features/Folder/folderSlice";
import songsSlice from "@/features/Songs/songsSlice";
import queueSlice from "@/features/RightSidebar/Queue/queueSlice";
import rightSidebarSlice from "@/slices/rightSidebarSlice";
import historySlice from "@/slices/historySlice";
import searchSlice from "@/features/Search/searchSlice";
// ...

export const store = configureStore({
  reducer: {
    auth: authslice,
    player: playerSlice,
    library: librarySlice,
    playlists: playlistSlice,
    folders: foldersSlice,
    songs: songsSlice,
    queue: queueSlice,
    rightSidebar: rightSidebarSlice,
    history: historySlice,
    search: searchSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(historyListenerMiddleware.middleware)
      .prepend(folderSyncMiddleware.middleware)
      .prepend(playTrackingMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
