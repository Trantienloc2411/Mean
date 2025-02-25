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
          : [{ type: "RentalLocation", id: "LIST" }],
    }),
    getRentalLocationById: builder.query({
      query: (id) => `rental-location/${id}`,
      providesTags: ["RentalLocation"],

    }),
    getRentalLocationByOwnerId: builder.query({
      query: (ownerId) =>
        `rental-location/all-rental-location?ownerId=${ownerId}`,
      providesTags: ["RentalLocation"], 
    }),
    createRentalLocation: builder.mutation({
      query: (newRental) => ({
        url: "rental-location/create-rental-location",
        method: "POST",
        body: newRental,
      }),
      invalidatesTags: ["RentalLocation"], 
    }),
    }),
});

export const {
  useGetAllRentalLocationQuery,
  useGetRentalLocationByIdQuery,
  useGetRentalLocationByOwnerIdQuery,
  useCreateRentalLocationMutation,
} = rentalApi;
