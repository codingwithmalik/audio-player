import { createListenerMiddleware } from "@reduxjs/toolkit";
import { activatePrivateSession, endPrivateSession } from "@/features/Profile/settingsSlice";

export const privateSessionMiddleware = createListenerMiddleware();

const SESSION_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

privateSessionMiddleware.startListening({
  actionCreator: activatePrivateSession,
  effect: async (_action, listenerApi) => {
    // If a session was already running (turned off then back on before its
    // timer fired), cancel that stale timer so it doesn't end the new one early.
    listenerApi.cancelActiveListeners();

    await listenerApi.delay(SESSION_DURATION_MS);
    listenerApi.dispatch(endPrivateSession());
  },
});
