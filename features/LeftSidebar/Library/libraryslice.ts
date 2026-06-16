import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

import {
  LibraryItem,
  LibraryState,
  SortType,
  FilterType,
} from "./libraryTypes";

// import { libraryData } from "@/lib/libraryData";
import { playlists, folders } from "@/lib/mockData";
import { Folder } from "@/types/folder";
import { Playlist } from "@/types/playlist";

const initialState: LibraryState = {
  playlists: playlists,
  folders: folders,
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

    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload);
    },
    addFolder: (state, action: PayloadAction<Folder>) => {
      state.folders.push(action.payload);
    },
  },
});

export const {
  setSearch,
  setSort,
  addPlaylist,
  addFolder,
  toggleFilter,
  clearFilters,
} = librarySlice.actions;

export default librarySlice.reducer;

// export const selectFilteredItems = createSelector(
//   [
//     (state: { library: LibraryState }) => state.library.playlists,
//     (state: { library: LibraryState }) => state.library.folders,
//     (state: { library: LibraryState }) => state.library.search,
//     (state: { library: LibraryState }) => state.library.sort,
//     (state: { library: LibraryState }) => state.library.filters,
//   ],
//   (playlists, folders, search, sort, filters) => {
//     // Determine which types to include based on active filters
//     const showPlaylists = filters.length === 0 || filters.includes("playlists");
//     const showFolders = filters.length === 0 || filters.includes("folders");

//     let result: LibraryItem[] = [
//       ...(showPlaylists ? playlists : []),
//       ...(showFolders ? folders : []),
//     ];
//     if (search.trim()) {
//       const searchLower = search.toLowerCase();
//       result = result.filter((item) =>
//         item.title.toLowerCase().includes(searchLower),
//       );
//     }

//     result = [...result].sort((a, b) => {
//       if (sort === "alphabetical") {
//         return a.title.localeCompare(b.title);
//       }
//       if (sort === "recently-added" || sort === "recents") {
//         // only recents are here for now but we have to create a seperate sort for recents because the recents means the recently played.
//         // Sort descending by createdAt ISO string (lexicographic works for ISO dates)
//         return b.createdAt.localeCompare(a.createdAt);
//       }
//       return 0;
//     });

//     return result;
//   },
// );

export const selectFilteredItems = createSelector(
  [
    (state: RootState) => state.library.playlists,
    (state: RootState) => state.library.folders,
    (state: RootState) => state.library.search,
    (state: RootState) => state.library.sort,
    (state: RootState) => state.library.filters,
    (state: RootState) => state.auth.user?.id,
  ],

  (playlists, folders, search, sort, filters, userId): LibraryItem[] => {
    if (!userId) return []; // not logged in — nothing to show

    const showPlaylists = filters.length === 0 || filters.includes("playlists");
    const showFolders = filters.length === 0 || filters.includes("folders");

    let result: LibraryItem[] = [
      ...(showPlaylists ? playlists.filter((p) => p.ownerId === userId) : []),
      ...(showFolders ? folders.filter((f) => f.ownerId === userId) : []),
    ];

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchLower)
      );
    }

    result = [...result].sort((a, b) => {
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      if (sort === "recently-added" || sort === "recents")
        return b.createdAt.localeCompare(a.createdAt);
      return 0;
    });

    return result;
  }
);