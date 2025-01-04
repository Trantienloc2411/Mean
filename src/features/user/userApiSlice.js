import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users", // Endpoint: /users
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`, // Endpoint: /users/:id
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),
  }),
  overrideExisting: false, // Không ghi đè các endpoint khác nếu tồn tại
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation } =
  userApiSlice;
