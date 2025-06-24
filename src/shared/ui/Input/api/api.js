import { createApi } from "@reduxjs/toolkit/query/react";
import axios from "axios";

const CDN_URL = import.meta.env.VITE_CDN_URL;

// Кастомная функция, которая вместо fetch использует axios
async function axiosBaseQuery({ url, method, body, onUploadProgress }) {
  try {
    const response = await axios({
      url: `${CDN_URL}${url}`,
      method,
      data: body,
      onUploadProgress, // здесь получим прогресс
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Возвращаем { data } в формате, который понимает RTK Query
    return { data: response.data };
  } catch (error) {
    // Если ошибка
    return {
      error: error.response?.data || "Ошибка загрузки файла",
    };
  }
}

// Создаём API
export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: axiosBaseQuery, // Используем нашу функцию
  endpoints: (builder) => ({
    // Описываем эндпоинт uploadFile (mutation)
    uploadFile: builder.mutation({
      query: ({ file, onUploadProgress }) => {
        // Собираем FormData из файла
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/upload",
          method: "POST",
          body: formData,
          onUploadProgress,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = uploadApi;
