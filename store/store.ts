import { configureStore } from "@reduxjs/toolkit";
import authslice from "@/features/Auth/authSlice";
import librarySlice from "@/features/LeftSidebar/Library/libraryslice";
import playerSlice from "@/store/playerSlice";
// ...

export const store = configureStore({
  reducer: {
    auth: authslice,
    player:playerSlice,
    library: librarySlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
