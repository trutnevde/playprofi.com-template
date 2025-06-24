import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const trendsCountApi = createApi({
  reducerPath: "trendsCountApi",
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
  keepUnusedDataFor: 300, // Кэшируем данные на 5 минут
  endpoints: (builder) => ({
    getCountSignals: builder.query({
      // Принимаем в аргументах user_id, чтобы сформировать URL
      query: () => `/trendovik/db/get_count_signals_trendovik_base`,
      // Добавляем теги для инвалидации кэша
      providesTags: ['SignalsCount'],
    }),
  }),
});

// Генерируем хук для запроса
export const { useGetCountSignalsQuery } = trendsCountApi;
