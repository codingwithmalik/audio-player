import { configureStore } from "@reduxjs/toolkit";
import authslice from "../slices/authslice";
import deviceSlice from "../slices/deviceslice";
// ...

export const store = configureStore({
  reducer: {
    auth: authslice,
    device: deviceSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
