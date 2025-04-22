import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ data }) => ({
        url: "/user/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    forgetPasswordToken: builder.mutation({
      query: (credentials) => ({
        url: "/user/forgot-password-token",
        method: "POST",
        body: credentials,
        // credentials: "include",
      }),
    }),
    sendOtpEmail: builder.mutation({
      query: (credentials) => ({
        url: "/user/send-otp",
        method: "POST",
        body: credentials,
        // credentials: "include",
      }),
    }),
    verifyEmail: builder.mutation({
      query: (credentials) => ({
        url: "/user/verify-email",
        method: "POST",
        body: credentials,
        // credentials: "include",
      }),
    }),
    resetPasswordToken: builder.mutation({
      query: (credentials) => ({
        url: "/user/reset-password/{token}",
        method: "PUT",
        body: credentials,
        // credentials: "include",
      }),
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: "/user/password",
        method: "PUT",
        body: credentials,
        // credentials: "include",
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
  useGetUserQuery,
  useLazyGetRoleByIdQuery,
  useLazyRefreshTokenQuery,
  useForgetPasswordTokenMutation,
  useResetPasswordTokenMutation,
  useSendOtpEmailMutation,
  useVerifyEmailMutation,
  useUpdatePasswordMutation,
} = authApi;
