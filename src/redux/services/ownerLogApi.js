import { apiSlice } from "./apiSlice";

export const ownerLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerLogsByOwnerId: builder.query({
      query: (id) => `owner-status-log/owner/${id}`,
      providesTags: (result, error, id) => [{ type: "OwnerLog", id }],
    }),
  }),
});

export const { useGetOwnerLogsByOwnerIdQuery } = ownerLogApi;
