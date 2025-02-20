import { apiSlice } from "./apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useUpdateBusinessMutation } = rentalApi;
