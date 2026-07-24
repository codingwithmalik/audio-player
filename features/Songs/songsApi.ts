import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertSongs, removeSong } from "./songsSlice";
import { Song } from "@/types/song";

export const songsApi = createApi({
  reducerPath: "songsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Song"],
  endpoints: (builder) => ({
    getSongs: builder.query<
      Song[],
      {
        language?: string;
        genre?: string;
        skip?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/songs",
        params: params || undefined,
      }),
      // Every fetched batch lands in the existing normalized cache —
      // no component needs to change how it reads song data.
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs(data));
        } catch {
          // error surfaces via the hook's own `error` field — nothing to do here
        }
      },
      providesTags: ["Song"],
    }),

    getSongById: builder.query<Song, string>({
      query: (id) => `/songs/${id}`,
      async onQueryStarted(_id, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs([data]));
        } catch {}
      },
      providesTags: (_result, _error, id) => [{ type: "Song", id }],
    }),

    createSong: builder.mutation<Song, Partial<Song>>({
      query: (body) => ({
        url: "/songs",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs([data]));
        } catch {}
      },
      invalidatesTags: ["Song"],
    }),

    updateSong: builder.mutation<Song, { id: string; data: Partial<Song> }>({
      query: ({ id, data }) => ({
        url: `/songs/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertSongs([data]));
        } catch {}
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Song", id }],
    }),

    deleteSong: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/songs/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(removeSong(id));
        } catch {}
      },
      invalidatesTags: ["Song"],
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetSongByIdQuery,
  useCreateSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
} = songsApi;
