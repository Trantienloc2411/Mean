import { apiSlice } from "./apiSlice";

export const rentalLocationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllRentalLocations: builder.query({
            query: () => "/rental-location/all-rental-location",
            providesTags: ["RentalLocation"],
        }),

        getRentalLocationById: builder.query({
            query: (id) => `/rental-location/${id}`,
            providesTags: ["RentalLocation"],
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
            query: ({ id, ...data }) => ({
                url: `/rental-location/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["RentalLocation"],
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
