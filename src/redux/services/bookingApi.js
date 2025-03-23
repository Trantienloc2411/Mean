import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBookings: builder.query({
            query: () => "/booking/all-bookings",
            transformResponse: (response) => response.data,
            providesTags: ["Booking"],
        }),

        getBookingById: builder.query({
            query: (id) => `/booking/${id}`,
            transformResponse: (response) => response.data,
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        getBookingsByCustomerId: builder.query({
            query: (customerId) => `/booking/booking-history/${customerId}`,
            transformResponse: (response) => response.data,
            providesTags: ["Booking"],
        }),

        getBookingsByOwnerId: builder.query({
            query: (ownerId) => `/booking/all-booking-by-owner/${ownerId}`,
            transformResponse: (response) => response.data,
            providesTags: ["Booking"],
        }),

        getBookingsByRentalLocationId: builder.query({
            query: (rentalLocationId) => `/booking/all-booking-in-rental-location/${rentalLocationId}`,
            transformResponse: (response) => response.data,
            providesTags: ["Booking"],
        }),

        createBooking: builder.mutation({
            query: (booking) => ({
                url: "/booking/create-booking",
                method: "POST",
                body: booking,
            }),
            invalidatesTags: ["Booking"],
        }),

        updateBooking: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/booking/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Booking", id },
                "Booking"
            ],
        }),
    }),
});

export const {
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
    useGetBookingsByCustomerIdQuery,
    useGetBookingsByOwnerIdQuery,
    useGetBookingsByRentalLocationIdQuery,
    useCreateBookingMutation,
    useUpdateBookingMutation,
} = bookingApi;