import { apiSlice } from "./apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBusiness: builder.mutation({
      query: ({ data }) => ({
        url: `/business-information/create-business-information`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Business"],
    }),
    updateBusiness: builder.mutation({
      query: ({ id, updatedBusiness }) => ({
        url: `/business-information/${id}`,
        method: "PUT",
        body: updatedBusiness,
      }),
      invalidatesTags: ["Business"],
    }),
  }),
});

export const { useUpdateBusinessMutation, useCreateBusinessMutation } =
  rentalApi;
