import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    refreshToken: builder.query({
      query: () => ({
        url: "/user/refresh",
        method: "GET",
        credentials: "include",
      }),
    }),

    getUser: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),

    getRoleById: builder.query({
      query: (roleId) => `/role/${roleId}`,
      providesTags: ["Role"],
    }),

    logout: builder.query({
      query: () => ({
        url: "/user/logout",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutQuery,
  useLazyGetUserQuery,
  useLazyGetRoleByIdQuery,
  useLazyRefreshTokenQuery,
} = authApi;
