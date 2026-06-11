import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LibraryItem, SortType, FilterType } from "./libraryTypes";

import { libraryData } from "@/lib/libraryData";
interface LibraryState {
  items: LibraryItem[];
  search: string;
  sort: SortType;
  filters: FilterType[];
}

const initialState: LibraryState = {
  items: libraryData,
  search: "",
  sort: "recents",
  filters: [],
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

    // Toggles a filter on/off. If it's already active, remove it.
    // If not active, add it. Multiple filters can be active simultaneously.
    toggleFilter: (state, action: PayloadAction<FilterType>) => {
      const filter = action.payload;
      const index = state.filters.indexOf(filter);
      if (index !== -1) {
        state.filters.splice(index, 1); // remove if already active
      } else {
        state.filters.push(filter); // add if not active
      }
    },

    clearFilters: (state) => {
      state.filters = [];
    },

    addPlaylist: (state, action: PayloadAction<LibraryItem>) => {
      state.items.push(action.payload);
    },
  },
});

export const { setSearch, setSort, addPlaylist, toggleFilter, clearFilters } =
  librarySlice.actions;

export default librarySlice.reducer;

export const selectFilteredItems = (state: { library: LibraryState }) => {
  const { items, search, sort, filters } = state.library;

  // 1. Filter by active pills
  let result = items.filter((item) => {
    // No active filters → show everything
    if (filters.length === 0) return true;

    // "playlists" pill → only playlists
    if (filters.includes("playlists") && item.type !== "playlist") return false;

    // "folders" pill → only folders
    if (filters.includes("folders") && item.type !== "folder") return false;

    return true;
  });

  // 2. Filter by search query
  if (search.trim()) {
    result = result.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // 3. Sort
  result = [...result].sort((a, b) => {
    if (sort === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    // recents / recently-added — preserve original insertion order
    return 0;
  });

  return result;
};

