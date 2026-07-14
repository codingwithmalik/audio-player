import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setSong } from "@/store/playerSlice";
import { incrementPlayCount } from "@/features/Songs/songsSlice";
import { touchPlaylist } from "@/features/Playlist/playlistSlice";
import type { RootState } from "@/store/store";

export const playTrackingMiddleware = createListenerMiddleware();

playTrackingMiddleware.startListening({
  actionCreator: setSong,
  effect: (action, listenerApi) => {
    const songId = action.payload;
    const state = listenerApi.getState() as RootState;
    const { sourceType, sourceId } = state.queue;

    listenerApi.dispatch(incrementPlayCount(songId));

    if (sourceType === "playlist" && sourceId) {
      listenerApi.dispatch(touchPlaylist(sourceId));
    }
  },
});