import { api } from "../../../app/api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // login: builder.query({
    //   query: (body) => ({
    //     url: "/user/login",
    //     method: "POST",
    //     body,
    //   }),
    // }),
  }),
});
