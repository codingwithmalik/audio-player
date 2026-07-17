import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";

interface LocalFilesState {
  songIds: string[];
  isParsing: boolean;
  error: string | null;
}

const initialState: LocalFilesState = {
  songIds: [],
  isParsing: false,
  error: null,
};

const localFilesSlice = createSlice({
  name: "localFiles",
  initialState,
  reducers: {
    addLocalFileIds(state, action: PayloadAction<string[]>) {
      for (const id of action.payload) {
        if (!state.songIds.includes(id)) state.songIds.push(id);
      }
    },
    removeLocalFile(state, action: PayloadAction<string>) {
      state.songIds = state.songIds.filter((id) => id !== action.payload);
    },
    clearLocalFiles(state) {
      state.songIds = [];
    },
    setParsing(state, action: PayloadAction<boolean>) {
      state.isParsing = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  addLocalFileIds,
  removeLocalFile,
  clearLocalFiles,
  setParsing,
  setError,
} = localFilesSlice.actions;

export const selectLocalFileIds = (state: RootState) =>
  state.localFiles.songIds;
export const selectIsParsingLocalFiles = (state: RootState) =>
  state.localFiles.isParsing;
export const selectLocalFilesError = (state: RootState) =>
  state.localFiles.error;
export const selectLocalFileCount = (state: RootState) =>
  state.localFiles.songIds.length;

export default localFilesSlice.reducer;
