import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setHistory, clearHistory } from "@/slices/historySlice";

export const historyApi = createApi({
  reducerPath: "historyApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["History"],
  endpoints: (builder) => ({
    getHistory: builder.query<string[], void>({
      query: () => "/history",
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setHistory(data));
        } catch {}
      },
      providesTags: ["History"],
    }),

    addToHistory: builder.mutation<string[], string>({
      query: (songId) => ({
        url: "/history",
        method: "POST",
        body: { songId },
      }),
      // Deliberately no onQueryStarted dispatch here — the click-time
      // `songPlayed` dispatch (per existing behavior) already updates
      // Redux instantly; this call just persists it server-side.
      invalidatesTags: ["History"],
    }),

    clearHistoryRemote: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/history", method: "DELETE" }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(clearHistory());
        } catch {}
      },
      invalidatesTags: ["History"],
    }),
  }),
});

export const {
  useGetHistoryQuery,
  useAddToHistoryMutation,
  useClearHistoryRemoteMutation,
} = historyApi;
