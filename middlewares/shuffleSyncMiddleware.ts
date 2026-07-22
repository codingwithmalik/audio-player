import { createListenerMiddleware } from "@reduxjs/toolkit";
import { toggleShuffle } from "@/slices/playerSlice";
import {
  shuffleQueue,
  unshuffleQueue,
} from "@/features/RightSidebar/Queue/queueSlice";
import type { RootState } from "@/store/store";

export const shuffleSyncMiddleware = createListenerMiddleware();

shuffleSyncMiddleware.startListening({
  actionCreator: toggleShuffle,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;

    if (state.player.isShuffle) {
      listenerApi.dispatch(shuffleQueue());
    } else {
      listenerApi.dispatch(
        unshuffleQueue({ currentSongId: state.player.currentSongId }),
      );
    }
  },
});
