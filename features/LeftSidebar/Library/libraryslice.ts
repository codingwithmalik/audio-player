import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LibraryItem, SortType } from "./libraryTypes";

import { libraryData } from "@/lib/libraryData";

interface LibraryState {
  items: LibraryItem[];
  search: string;
  sort: SortType;
}

const initialState: LibraryState = {
  items: libraryData,
  search: "",
  sort: "mixed",
};

const librarySlice = createSlice({
  name: "library",

  initialState,

  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setSort: (state, action: PayloadAction<SortType>) => {
      state.sort = action.payload;
    },

    addPlaylist: (state, action: PayloadAction<LibraryItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { setSearch, setSort, addPlaylist } = librarySlice.actions;

export default librarySlice.reducer;
