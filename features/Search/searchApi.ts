import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertSongs } from "@/features/Songs/songsSlice";
import { Song } from "@/types/song";
import { clearRecentSearches, setRecentSearches } from "./searchSlice";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["RecentSearches"],
  endpoints: (builder) => ({
    search: builder.query<{ songs: Song[] }, string>({
      query: (q) => ({ url: "/search", params: { q } }),
      async onQueryStarted(_q, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs(data.songs));
        } catch {}
      },
    }),

    getRecentSearches: builder.query<string[], void>({
      query: () => "/search/recent",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRecentSearches(data)); // new reducer, see below
        } catch {}
      },
      providesTags: ["RecentSearches"],
    }),

    addRecentSearch: builder.mutation<string[], string>({
      query: (songId) => ({
        url: "/search/recent",
        method: "POST",
        body: { songId },
      }),
      invalidatesTags: ["RecentSearches"],
    }),

    removeRecentSearchRemote: builder.mutation<string[], string>({
      query: (songId) => ({
        url: `/search/recent/${songId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RecentSearches"],
    }),

    clearRecentSearchesRemote: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/search/recent", method: "DELETE" }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(clearRecentSearches());
        } catch {}
      },
      invalidatesTags: ["RecentSearches"],
    }),
  }),
});

export const {
  useSearchQuery,
  useLazySearchQuery,
  useGetRecentSearchesQuery,
  useLazyGetRecentSearchesQuery,
  useAddRecentSearchMutation,
  useRemoveRecentSearchRemoteMutation,
  useClearRecentSearchesRemoteMutation,
} = searchApi;
