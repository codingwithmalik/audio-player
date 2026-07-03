import { configureStore } from "@reduxjs/toolkit";
import authslice from "@/features/Auth/authSlice";
import librarySlice from "@/features/LeftSidebar/Library/libraryslice";
import playerSlice from "@/store/playerSlice";
import playlistSlice from "@/features/Playlist/playlistSlice"
import foldersSlice from "@/features/Folder/folderSlice"
import songsSlice from "@/features/Songs/songsSlice"
import LikedSongsSlice from "@/features/LikedSongs/likedSongsSlice";
import queueSlice from "@/features/RightSidebar/Queue/queueSlice";
// ...

export const store = configureStore({
  reducer: {
    auth: authslice,
    player:playerSlice,
    library: librarySlice,
    playlists: playlistSlice,
    folders:foldersSlice,
    songs: songsSlice,
    likedSongs: LikedSongsSlice,
    queue: queueSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
