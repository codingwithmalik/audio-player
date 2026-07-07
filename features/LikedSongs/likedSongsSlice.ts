import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { PlaylistSong } from "@/types/playlist";

interface LikedSongsState {
  songs: PlaylistSong[];
}

const initialState: LikedSongsState = {
  songs: [
    {songId: "s1", addedAt: new Date().toISOString()},
    {songId: "s3", addedAt: new Date().toISOString()},
    {songId: "s2", addedAt: new Date().toISOString()},
    {songId: "s4", addedAt: new Date().toISOString()},
  ],
};
const likedSongsSlice = createSlice({
  name: "likedSongs",
  initialState,
  reducers: {
    likeSong(state, action: PayloadAction<PlaylistSong>) {
      if (!state.songs.some((song) => song.songId === action.payload.songId)) {
        state.songs.push(action.payload );
      }
    },

    unlikeSong(state, action: PayloadAction<string>) {
      state.songs = state.songs.filter(
        (song) => song.songId !== action.payload,
      );
    },

    toggleLike(state, action: PayloadAction<PlaylistSong>) {
      const index = state.songs.findIndex(
        (song) => song.songId === action.payload.songId,
      );

      if (index === -1) {
        state.songs.push(action.payload);
      } else {
        state.songs.splice(index, 1);
      }
    },
  },
});

export const { likeSong, unlikeSong, toggleLike } =
  likedSongsSlice.actions;

export default likedSongsSlice.reducer;

/* ────────────────────────────────────────────────────────── */
/* Selectors                                                 */
/* ────────────────────────────────────────────────────────── */

export const selectLikedSongs = (state: RootState) =>
  state.likedSongs.songs;

export const selectLikedSongIds = (state: RootState) =>
  state.likedSongs.songs.map((song) => song.songId);

export const selectIsLiked = (
  state: RootState,
  songId: string,
) =>
  state.likedSongs.songs.some((song) => song.songId === songId);

export const selectLikedCount = (state: RootState) =>
  state.likedSongs.songs.length;