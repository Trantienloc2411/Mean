import { apiSlice } from "./apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: () => "/transaction/all-transactions",
      providesTags: ["User"],
    }),
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "/transaction/create-transaction",
        method: "POST",
        body: transactionData,
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
});

export const { useGetAllTransactionQuery, useCreateTransactionMutation } = transactionApi;
