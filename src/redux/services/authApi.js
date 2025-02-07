import { apiSlice } from "./apiSlice";
import { saveToken, removeToken, saveUserId } from "../../utils/storage";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.accessToken) {
            saveToken(data.accessToken);
            saveUserId(data._id);
          }
        } catch (err) {
          console.error("Login failed", err);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          await queryFulfilled;
          removeToken();
        } catch (err) {
          console.error("Logout failed", err);
        }
      },
    }),

    getUser: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),

    getRoleById: builder.query({
      query: (roleId) => `/role/${roleId}`,
      providesTags: ["Role"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  // useGetUserQuery,
  // useGetRoleByIdQuery,
  useLazyGetUserQuery,
  useLazyGetRoleByIdQuery,
} = authApi;
