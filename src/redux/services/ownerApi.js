import { apiSlice } from "./apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerById: builder.query({
      query: (id) => `owner/${id}`,
    }),
  }),
});

export const { useLazyGetOwnerByIdQuery } = rentalApi;
