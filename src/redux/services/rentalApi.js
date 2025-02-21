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
      query: (id) => `rental-location/${id}`,
    }),
    getRentalLocationByOwnerId: builder.query({
      query: (ownerId) =>
        `rental-location/all-rental-location?ownerId=${ownerId}`,
    }),
    createRentalLocation: builder.mutation({
      query: (newRental) => ({
        url: "rental-location/create-rental-location",
        method: "POST",
        body: newRental,
      }),
      invalidatesTags: [{ type: "RentalList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllRentalLocationQuery,
  useGetRentalLocationByIdQuery,
  useGetRentalLocationByOwnerIdQuery,
  useCreateRentalLocationMutation,
} = rentalApi;
