import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upsertFolders, removeFolder } from "./folderSlice";
import { playlistsApi } from "@/features/Playlist/playlistsApi";
import { Folder } from "@/types/folder";
import { Playlist } from "@/types/playlist";

export const foldersApi = createApi({
  reducerPath: "foldersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Folder"],
  endpoints: (builder) => ({
    getFolders: builder.query<Folder[], void>({
      query: () => "/folders",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertFolders(data));
        } catch {}
      },
      providesTags: ["Folder"],
    }),

    getFolder: builder.query<Folder & { playlists: Playlist[] }, string>({
      query: (id) => `/folders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Folder", id }],
    }),

    createFolder: builder.mutation<Folder, { title: string }>({
      query: (body) => ({ url: "/folders", method: "POST", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertFolders([data]));
        } catch {}
      },
      invalidatesTags: ["Folder"],
    }),

    renameFolder: builder.mutation<Folder, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `/folders/${id}`,
        method: "PATCH",
        body: { title },
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(upsertFolders([data]));
        } catch {}
      },
      invalidatesTags: (_r, _e, { id }) => [{ type: "Folder", id }],
    }),

    deleteFolder: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/folders/${id}`, method: "DELETE" }),
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(removeFolder(id));
          dispatch(playlistsApi.util.invalidateTags(["Playlist"])); // the actual cross-slice trigger
        } catch {}
      },
      invalidatesTags: ["Folder"],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useGetFolderQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} = foldersApi;
