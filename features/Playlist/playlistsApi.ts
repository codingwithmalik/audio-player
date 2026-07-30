import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { removePlaylist, upsertPlaylists } from "./playlistSlice";
import { Playlist } from "@/types/playlist";

export const playlistsApi = createApi({
  reducerPath: "playlistsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Playlist"],
  endpoints: (builder) => ({
    getPlaylists: builder.query<
      Playlist[],
      { folderId?: string | null } | void
    >({
      query: (params) => ({
        url: "/playlists",
        params:
          params?.folderId !== undefined
            ? { folderId: params.folderId }
            : undefined,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists(data));
        } catch {}
      },
      providesTags: ["Playlist"],
    }),

    getPlaylist: builder.query<Playlist, string>({
      query: (id) => `/playlists/${id}`,
      async onQueryStarted(_id, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      providesTags: (_r, _e, id) => [{ type: "Playlist", id }],
    }),

    createPlaylist: builder.mutation<
      Playlist,
      { title: string; description?: string; coverImage?: string }
    >({
      query: (body) => ({ url: "/playlists", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: ["Playlist"],
    }),

    updatePlaylist: builder.mutation<
      Playlist,
      { id: string; data: Partial<Playlist> }
    >({
      query: ({ id, data }) => ({
        url: `/playlists/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: "Playlist", id }],
    }),

    deletePlaylist: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/playlists/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(removePlaylist(id));
        } catch {}
      },
      invalidatesTags: ["Playlist"],
    }),

    permanentlyDeletePlaylist: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/playlists/${id}/permanent`, method: "DELETE" }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(removePlaylist(id));
        } catch {}
      },

      invalidatesTags: ["Playlist"],
    }),
    restorePlaylist: builder.mutation<Playlist, string>({
      query: (id) => ({ url: `/playlists/${id}/restore`, method: "POST" }),
      async onQueryStarted(_id, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: ["Playlist"],
    }),

    getTrash: builder.query<Playlist[], void>({
      query: () => "/playlists/trash",
      providesTags: ["Playlist"],
    }),

    addSongToPlaylist: builder.mutation<
      Playlist,
      { playlistId: string; songIds: string[] }
    >({
      query: ({ playlistId, songIds }) => ({
        url: `/playlists/${playlistId}/songs`,
        method: "POST",
        body: { songIds },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: (_r, _e, { playlistId }) => [
        { type: "Playlist", id: playlistId },
      ],
    }),

    removeSongFromPlaylist: builder.mutation<
      Playlist,
      { playlistId: string; songId: string }
    >({
      query: ({ playlistId, songId }) => ({
        url: `/playlists/${playlistId}/songs/${songId}`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: (_r, _e, { playlistId }) => [
        { type: "Playlist", id: playlistId },
      ],
    }),

    movePlaylist: builder.mutation<
      Playlist,
      { id: string; folderId: string | null }
    >({
      query: ({ id, folderId }) => ({
        url: `/playlists/${id}/move`,
        method: "PATCH",
        body: { folderId },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertPlaylists([data]));
        } catch {}
      },
      invalidatesTags: ["Playlist"],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  usePermanentlyDeletePlaylistMutation,
  useRestorePlaylistMutation,
  useGetTrashQuery,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
  useMovePlaylistMutation,
} = playlistsApi;
