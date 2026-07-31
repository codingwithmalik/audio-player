import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setPersonalInfo } from "./accountSlice";

interface ProfileResponse {
  username: string;
  coverImage?: string;
  personalInfo: { gender: string | null; dateOfBirth: string | null; country: string | null };
}

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/profile",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPersonalInfo(data.personalInfo));
        } catch {}
      },
    }),

    updateProfile: builder.mutation<ProfileResponse, Partial<ProfileResponse>>({
      query: (body) => ({ url: "/profile", method: "PATCH", body }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setPersonalInfo(data.personalInfo));
        } catch {}
      },
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;