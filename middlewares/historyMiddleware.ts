import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setSong } from "@/slices/playerSlice";
import { songPlayed } from "@/slices/historySlice";
import { RootState } from "@/store/store";
import { selectIsPrivateSessionActive } from "@/features/Profile/settingsSlice";

export const historyListenerMiddleware = createListenerMiddleware();

historyListenerMiddleware.startListening({
  actionCreator: setSong,
  effect: (action, listenerApi) => {
    const songId = action.payload;
    const state = listenerApi.getState() as RootState;
    if (songId) {
      if (selectIsPrivateSessionActive(state)) return;
      listenerApi.dispatch(songPlayed(songId));
    }
  },
});
