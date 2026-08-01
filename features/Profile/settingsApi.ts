import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { hydrateSettings } from "./settingsSlice";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<any, void>({
      query: () => "/settings",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(hydrateSettings(data));
        } catch {}
      },
      providesTags: ["Settings"],
    }),

    updateSettings: builder.mutation<any, any>({
      query: (body) => ({ url: "/settings", method: "PATCH", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(hydrateSettings(data));
        } catch {}
      },
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;