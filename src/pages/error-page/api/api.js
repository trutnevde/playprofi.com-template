import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const errorApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    sendErrorReport: builder.mutation({
      query: (errorData) => ({
        url: "/error-report",
        method: "POST",
        body: errorData,
      }),
    }),
  }),
});

export const { useSendErrorReportMutation } = errorApi;
