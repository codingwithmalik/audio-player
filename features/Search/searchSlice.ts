import { createSlice,  PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import type { SearchState } from "@/types/search";

const MAX_RECENT_SEARCHES = 20;

const initialState: SearchState = {
  query: "",
  recentSearches: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    clearQuery(state) {
      state.query = "";
    },
    /** Called when a song played via search actually gets played — not on every keystroke. */
    songSearchedAndPlayed(state, action: PayloadAction<string>) {
      const songId = action.payload;
      state.recentSearches = state.recentSearches.filter((id) => id !== songId);
      state.recentSearches.unshift(songId);
      if (state.recentSearches.length > MAX_RECENT_SEARCHES) {
        state.recentSearches.length = MAX_RECENT_SEARCHES;
      }
    },
    removeRecentSearch(state, action: PayloadAction<string>) {
      state.recentSearches = state.recentSearches.filter(
        (id) => id !== action.payload,
      );
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
  },
});

export const {
  setQuery,
  clearQuery,
  songSearchedAndPlayed,
  removeRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;

export const selectQuery = (state: RootState) => state.search.query;
export const selectRecentSearchIds = (state: RootState) =>
  state.search.recentSearches;

export default searchSlice.reducer;
