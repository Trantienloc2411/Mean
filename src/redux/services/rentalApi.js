import { apiSlice } from "./apiSlice";

export const rentalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRentalLocation: builder.query({
      query: () => "rental-location/all-rental-location",
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: "RentalList", id })),
              { type: "RentalList", id: "LIST" },
            ]
          : [{ type: "RentalList", id: "LIST" }],
    }),
    getRentalLocationById: builder.query({
      query: (id) => `rental-location/${id}`, // API endpoint for a specific rental location
    }),
  }),
});

export const { 
  useGetAllRentalLocationQuery,
  useGetRentalLocationByIdQuery, 



 } = rentalApi;