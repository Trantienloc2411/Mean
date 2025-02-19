import { apiSlice } from "./apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerById: builder.query({
      query: (id) => `owner/${id}`,
    }),
    getOwnerDetailByUserId: builder.query({
      query: (id) => `owner/detail-owner/${id}`,
    }),
  }),
});

export const { useLazyGetOwnerByIdQuery ,useGetOwnerDetailByUserIdQuery} = rentalApi;
