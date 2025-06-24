import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }), // TODO: Перенести в env
  tagTypes: [],
  endpoints: (builder) => ({
    // 🔹 Запрос на вход (авторизация)
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Запрос на регистрацию
    signup: builder.mutation({
      query: (body) => ({
        url: "/users/signup",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Запрос на сброс пароля (отправка email)
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "/users/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Запрос на установку нового пароля
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/users/reset-password",
        method: "POST",
        body,
      }),
    }),

    // 🔹 Запрос на гостевой вход
    guestLogin: builder.mutation({
      query: () => ({
        url: "/users/guest-login",
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useSignupMutation, 
  useForgotPasswordMutation, 
  useResetPasswordMutation,
  useGuestLoginMutation
} = usersApi;

export default usersApi;
