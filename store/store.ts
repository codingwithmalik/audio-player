import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { historyListenerMiddleware } from "@/middlewares/historyMiddleware";
import { playTrackingMiddleware } from "@/middlewares/playCountMiddleware";
import { shuffleSyncMiddleware } from "@/middlewares/shuffleSyncMiddleware";
import { privateSessionMiddleware } from "@/middlewares/privateSessionMiddleware";
import librarySlice from "@/features/LeftSidebar/Library/libraryslice";
import playerSlice from "@/slices/playerSlice";
import playlistSlice from "@/features/Playlist/playlistSlice";
import foldersSlice from "@/features/Folder/folderSlice";
import songsSlice from "@/features/Songs/songsSlice";
import queueSlice from "@/features/RightSidebar/Queue/queueSlice";
import rightSidebarSlice from "@/slices/rightSidebarSlice";
import historySlice from "@/slices/historySlice";
import searchSlice from "@/features/Search/searchSlice";
import accountSlice from "@/features/Profile/accountSlice";
import settingsSlice from "@/features/Profile/settingsSlice";
import localfilesSlice from "@/features/LeftSidebar/LocalFiles/localFilesSlice";
import { toastMiddleware } from "@/middlewares/toastMiddleware";
//New Api integrations
import { songsApi } from "@/features/Songs/songsApi";
import { playlistsApi } from "@/features/Playlist/playlistsApi";
import { foldersApi } from "@/features/Folder/foldersApi";
import { likedApi } from "@/features/Liked/likedApi";
import { historyApi } from "@/features/History/historyApi";
import { searchApi } from "@/features/Search/searchApi";
import { profileApi } from "@/features/Profile/profileApi";

export const store = configureStore({
  reducer: {
    player: playerSlice,
    library: librarySlice,
    playlists: playlistSlice,
    folders: foldersSlice,
    songs: songsSlice,
    queue: queueSlice,
    rightSidebar: rightSidebarSlice,
    history: historySlice,
    search: searchSlice,
    account: accountSlice,
    settings: settingsSlice,
    localFiles: localfilesSlice,
    //New Api integrations
    [songsApi.reducerPath]: songsApi.reducer,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
    [foldersApi.reducerPath]: foldersApi.reducer,
    [likedApi.reducerPath]: likedApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(historyListenerMiddleware.middleware)
      .prepend(playTrackingMiddleware.middleware)
      .prepend(shuffleSyncMiddleware.middleware)
      .prepend(privateSessionMiddleware.middleware)
      .prepend(toastMiddleware.middleware)
      //New Api integrations
      .concat(
        songsApi.middleware,
        foldersApi.middleware,
        likedApi.middleware,
        historyApi.middleware,
        searchApi.middleware,
        profileApi.middleware,
      )
      .concat(playlistsApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
