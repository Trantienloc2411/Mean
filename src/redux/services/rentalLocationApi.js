import { apiSlice } from "./apiSlice";

export const rentalLocationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRentalLocations: builder.query({
      query: (ownerId) => {
        let url = "/rental-location/all-rental-location";
        if (ownerId) {
          url += `?ownerId=${ownerId}`;
        }
        return url;
      },
      providesTags: ["RentalLocation"],
    }),

    getRentalLocationById: builder.query({
      query: (id) => `/rental-location/${id}`,
      providesTags: (result, error, id) => [{ type: "RentalLocation", id }],
    }),

    createRentalLocation: builder.mutation({
      query: (rentalLocation) => ({
        url: "/rental-location/create-rental-location",
        method: "POST",
        body: rentalLocation,
      }),
      invalidatesTags: ["RentalLocation"],
    }),

    updateRentalLocation: builder.mutation({
      query: ({ id, updatedData }) => {
        console.log("updateRentalLocation mutation called with:", { id, data });
        return {
          url: `/rental-location/${id}`,
          method: "PUT",
          body: updatedData, // Send data directly without nesting
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "RentalLocation", id },
        "RentalLocation",
      ],
    }),

    deleteRentalLocation: builder.mutation({
      query: (id) => ({
        url: `/rental-location/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RentalLocation"],
    }),
  }),
});

export const {
  useGetAllRentalLocationsQuery,
  useGetRentalLocationByIdQuery,
  useCreateRentalLocationMutation,
  useUpdateRentalLocationMutation,
  useDeleteRentalLocationMutation,
} = rentalLocationApi;
