import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/user/all-users",
      providesTags: ["User"],
    }),
    GetRoles: builder.query({
      query: () => "/role/all-roles",
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: (id) => `/user/${id}`,
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/user/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/user/edit-user/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    activeUser: builder.mutation({
      query: (id) => ({
        url: `/user/active/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/user/block-user/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActiveUserMutation,
  useBlockUserMutation,
} = userApi;
