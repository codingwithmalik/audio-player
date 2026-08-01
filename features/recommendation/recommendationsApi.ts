import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertSongs } from "../Songs/songsSlice";
import { Song } from "@/types/song";

export const recommendationsApi = createApi({
  reducerPath: "recommendationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getRecommendations: builder.query<
      { songs: Song[] },
      {
        type: "trending" | "madeForYou" | "popular";
        skip?: number;
        limit?: number;
        excludeIds?: string[];
      }
    >({
      query: ({ type, skip = 0, limit = 20, excludeIds = [] }) => ({
        url: "/recommendations",
        params: { type, skip, limit, excludeIds: excludeIds.join(",") },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs(data.songs));
        } catch {}
      },
    }),
  }),
});

export const { useGetRecommendationsQuery } = recommendationsApi;
