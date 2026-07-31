import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertPlaylists } from "@/features/Playlist/playlistSlice";
import { Playlist } from "@/types/playlist";

export const likedApi = createApi({
  reducerPath: "likedApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Liked"],
  endpoints: (builder) => ({
    getLiked: builder.query<Playlist, void>({
      query: () => "/liked",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      providesTags: ["Liked"],
    }),

    toggleLiked: builder.mutation<
      { liked: boolean; playlist: Playlist },
      string
    >({
      query: (songId) => ({
        url: "/liked/toggle",
        method: "POST",
        body: { songId },
      }),
      async onQueryStarted(_songId, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data.playlist]));
        } catch {}
      },
      invalidatesTags: ["Liked"],
    }),
  }),
});

export const { useGetLikedQuery, useToggleLikedMutation } = likedApi;
