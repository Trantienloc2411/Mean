import { apiSlice } from "./apiSlice";

export const accommodationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllAccommodations: builder.query({
            query: () => "/accommodation/all-accommodations",
            transformResponse: (response) => response.data,
            providesTags: ["Accommodation"],
        }),

        getAccommodationById: builder.query({
            query: (id) => `/accommodation/${id}`,
            transformResponse: (response) => response.data[0],
            providesTags: (result, error, id) => [{ type: "Accommodation", id }],
        }),

        getAccommodationsByRentalLocation: builder.query({
            query: (rentalLocationId) => `/accommodation/rental-location/${rentalLocationId}`,
            transformResponse: (response) => response.data,
            providesTags: (result, error, rentalLocationId) => [{ type: "Accommodation", rentalLocationId }],
        }),

        createAccommodation: builder.mutation({
            query: (accommodation) => ({
                url: "/accommodation/create-accommodation",
                method: "POST",
                body: accommodation,
            }),
            invalidatesTags: ["Accommodation"],
        }),

        updateAccommodation: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/accommodation/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Accommodation", id },
                "Accommodation"
            ],
        }),

        deleteAccommodation: builder.mutation({
            query: (id) => ({
                url: `/accommodation/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Accommodation"],
        }),
    }),
});

export const {
    useGetAllAccommodationsQuery,
    useGetAccommodationByIdQuery,
    useGetAccommodationsByRentalLocationQuery,
    useCreateAccommodationMutation,
    useUpdateAccommodationMutation,
    useDeleteAccommodationMutation,
} = accommodationApi;