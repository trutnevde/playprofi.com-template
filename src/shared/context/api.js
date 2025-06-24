import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const userTokensApi = createApi({
  reducerPath: "userTokensApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        const token = userData?.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserTokens: builder.query({
      query: () => "/users/db/get_user_tokens",
    }),
  }),
});

export const { useGetUserTokensQuery } = userTokensApi;