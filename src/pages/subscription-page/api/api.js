import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
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
  tagTypes: ['Cards'],
  endpoints: (builder) => ({
    verifyCode: builder.mutation({
      query: (code) => ({
        url: "/users/verify-code",
        method: "POST",
        body: { code },
      }),
    }),
    createTinkoffLink: builder.mutation({
      query: ({ subscription_type, period, payment_provider, promo_code_id }) => ({
        url: `/subscriptions/create/${payment_provider || 'tinkoff'}`,
        method: "POST",
        params: { subscription_type, period, promo_code_id },
      }),
    }),
    changeSubscription: builder.mutation({
      query: ({ subscription_type, period }) => ({
        url: "/subscriptions/change",
        method: "POST",
        params: { subscription_type, period },
      }),
    }),
    getSubscriptionDetails: builder.query({
      query: () => ({
        url: "/subscriptions/details",
        method: "GET",
      }),
    }),
    getSubscriptionCards: builder.query({
      query: () => ({
        url: '/subscriptions/cards',
        method: 'GET',
      }),
      providesTags: ['Cards'],
    }),
    updateCard: builder.mutation({
      query: (cardData) => ({
        url: '/subscriptions/cards/update',
        method: 'POST',
        body: cardData,
      }),
      invalidatesTags: ['Cards'],
    }),
    renewSubscription: builder.mutation({
      query: () => ({
        url: '/subscriptions/renew',
        method: 'POST',
      }),
    }),
    restoreSubscription: builder.mutation({
      query: () => ({
        url: '/subscriptions/restore',
        method: 'POST',
      }),
    }),
    deleteCard: builder.mutation({
      query: (cardId) => ({
        url: `/subscriptions/cards/${cardId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Cards'],
    }),
    setActiveCard: builder.mutation({
      query: (cardId) => ({
        url: `/subscriptions/cards/${cardId}/active`,
        method: "PUT",
      }),
      invalidatesTags: ['Cards'],
    }),
    applyPromoCode: builder.mutation({
      query: ({ code, subscription_type, period }) => {
        return {
          url: "/subscriptions/promo/apply",
          method: "POST",
          params: { code, subscription_type, period },
        };
      },
    }),
  }),
});

export const { 
  useVerifyCodeMutation, 
  useCreateTinkoffLinkMutation,
  useGetSubscriptionDetailsQuery,
  useChangeSubscriptionMutation,
  useGetSubscriptionCardsQuery,
  useUpdateCardMutation,
  useRenewSubscriptionMutation,
  useRestoreSubscriptionMutation,
  useDeleteCardMutation,
  useSetActiveCardMutation,
  useApplyPromoCodeMutation,
} = subscriptionApi;
