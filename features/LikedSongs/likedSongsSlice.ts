import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

interface LikedSongsState {
  songIds: string[];
}

const initialState: LikedSongsState = {
  songIds: [],
};

const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState,
  reducers: {
    likeSong(state, action: PayloadAction<string>) {
      if (!state.songIds.includes(action.payload))
        state.songIds.push(action.payload);
    },
    unlikeSong(state, action: PayloadAction<string>) {
      state.songIds = state.songIds.filter((id) => id !== action.payload);
    },
    toggleLike(state, action: PayloadAction<string>) {
      const index = state.songIds.indexOf(action.payload);
      if (index === -1) state.songIds.push(action.payload);
      else state.songIds.splice(index, 1);
    },
  },
});

export const { likeSong, unlikeSong, toggleLike } = likedSongsSlice.actions;
export default likedSongsSlice.reducer;

export const selectLikedSongIds = (state: RootState) =>
  state.likedSongs.songIds;

export const selectIsLiked = (state: RootState, songId: string) =>
  state.likedSongs.songIds.includes(songId);

export const selectLikedCount = (state: RootState) =>
  state.likedSongs.songIds.length;