import { apiSlice } from "./apiSlice";

export const transactionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query({
            query: () => "/transaction/all-transactions",
            providesTags: ["Transaction"],
        }),
    }),
});
