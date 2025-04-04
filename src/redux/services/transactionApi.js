import { apiSlice } from "./apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: () => "/transaction/all-transactions",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetAllTransactionQuery } = transactionApi;
