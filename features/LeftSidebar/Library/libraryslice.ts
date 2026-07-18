import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

import {
  LibraryItem,
  LibraryState,
  SortType,
  FilterType,
} from "./libraryTypes";
import { selectPlaylists } from "@/features/Playlist/playlistSlice";
import { selectFolders } from "@/features/Folder/folderSlice";

// import { libraryData } from "@/lib/libraryData";

const initialState: LibraryState = {
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
  },
});

export const { setSearch, setSort, toggleFilter, clearFilters } =
  librarySlice.actions;

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
    selectPlaylists,
    selectFolders,
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
        item.title.toLowerCase().includes(searchLower),
      );
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "alphabetical":
          return a.title.localeCompare(b.title);

        case "recently-added":
          return b.createdAt.localeCompare(a.createdAt);

        case "recents": {
          const aTime =
            "accessedAt" in a && a.accessedAt ? a.accessedAt : a.createdAt;
          const bTime =
            "accessedAt" in b && b.accessedAt ? b.accessedAt : b.createdAt;
          return bTime.localeCompare(aTime);
        }

        default:
          return 0;
      }
    });

    return result;
  },
);
