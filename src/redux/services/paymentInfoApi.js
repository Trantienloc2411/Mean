import { apiSlice } from "./apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBank: builder.mutation({
      query: ({ data }) => ({
        url: `/payment-information/create-payment-information`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentInfo"],
    }),
    updateBank: builder.mutation({
      query: ({ id, updatedBusiness }) => ({
        url: `/payment-information/${id}`,
        method: "PUT",
        body: updatedBusiness,
      }),
      invalidatesTags: ["PaymentInfo"],
    }),
  }),
});

export const { useCreateBankMutation, useUpdateBankMutation } = paymentApi;
