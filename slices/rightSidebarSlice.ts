import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

type RightSidebarPanel =
  | { tab: "default" }
  | { tab: "queue" }
  | { tab: "addToPlaylist"; playlistId: string }
  | { tab: "addToFolder"; folderId: string };

interface RightSidebarState {
  panel: RightSidebarPanel;
}

const initialState: RightSidebarState = {
  panel: { tab: "default" },
};

const rightSidebarSlice = createSlice({
  name: "rightSidebar",
  initialState,
  reducers: {
    openQueue: (state) => {
      state.panel = { tab: "queue" };
    },
    openAddToPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string }>,
    ) => {
      state.panel = {
        tab: "addToPlaylist",
        playlistId: action.payload.playlistId,
      };
    },
    openAddToFolder: (state, action: PayloadAction<{ folderId: string }>) => {
      state.panel = { tab: "addToFolder", folderId: action.payload.folderId };
    },
    closeRightSidebarPanel: (state) => {
      state.panel = { tab: "default" };
    },
  },
});

export const {
  openQueue,
  openAddToPlaylist,
  openAddToFolder,
  closeRightSidebarPanel,
} = rightSidebarSlice.actions;

export const selectRightSidebarPanel = (state: RootState) =>
  state.rightSidebar.panel;
export const selectIsQueueOpen = (state: RootState) =>
  state.rightSidebar.panel.tab === "queue";
export const selectIsAddToFolderOpen = (state: RootState) =>
  state.rightSidebar.panel.tab === "addToFolder";
export const selectIsAddToPlaylistOpen = (state: RootState) =>
  state.rightSidebar.panel.tab === "addToPlaylist";

export default rightSidebarSlice.reducer;
