import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const addFavoriteApi = createApi({
  reducerPath: "addFavoriteApi",
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
    addFavorite: builder.mutation({
        query: ({ video }) => ({
          url: "/users/db/add_user_favorites",
          method: "POST",
          body: { video },
        }),
    }),      
  }),
});

export const { useAddFavoriteMutation } = addFavoriteApi;