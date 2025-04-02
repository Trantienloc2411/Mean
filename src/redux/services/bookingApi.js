import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBookings: builder.query({
            query: () => "/booking/all-bookings",
            transformResponse: (response) => response.data,
            providesTags: ["Booking"],
        }),

        getBookingById: builder.query({
            query: (id) => {
                console.log("Making API request for booking ID:", id)
                return `/booking/${id}`
            },
            transformResponse: (response, meta, arg) => {
                console.log("Raw API response for booking ID:", arg, response)

                if (!response) {
                    console.error("API returned empty response for booking ID:", arg)
                    return null
                }

                if (response.data) {
                    console.log("Response has data property:", response.data)
                    return response.data
                }

                console.log("Using response directly as data")
                return response
            },
            onError: (error, arg) => {
                console.error("Error fetching booking details for ID:", arg, error)
            },
            providesTags: (result, error, id) => [{ type: "Booking", id }],
        }),

        getBookingsByCustomerId: builder.query({
            query: (customerId) => `/booking/booking-history/${customerId}`,
            transformResponse: (response) => response,
            providesTags: ["Booking"],
        }),

        getBookingsByOwnerId: builder.query({
            query: (ownerId) => `/booking/all-booking-by-owner/${ownerId}`,
            transformResponse: (response) => {
                if (!response || !response.bookings) return [];
                return response.bookings.flatMap(bookingWrapper => {
                    if (Array.isArray(bookingWrapper)) {
                        return bookingWrapper;
                    } else if (typeof bookingWrapper === 'object') {
                        return Object.values(bookingWrapper);
                    }
                    return [];
                });
            },
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