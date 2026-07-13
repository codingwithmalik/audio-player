import { createListenerMiddleware} from "@reduxjs/toolkit";
import { setSong } from "@/store/playerSlice";
import { songPlayed } from "@/slices/historySlice";

export const historyListenerMiddleware = createListenerMiddleware();

historyListenerMiddleware.startListening({
  actionCreator: setSong,
  effect: (action, listenerApi) => {
    const songId = action.payload ;
    if (songId) {
      listenerApi.dispatch(songPlayed(songId));
    }
  },
});