import { apiSlice } from "./apiSlice";

export const RentalLogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRentalLogsByRentalId: builder.query({
      query: (id) => `/rental-location-status-log/rental/${id}`,
      providesTags: (result, error, id) => [{ type: "RentalLog", id }],
    }),
  }),
});

export const { useGetRentalLogsByRentalIdQuery } = RentalLogApi;
