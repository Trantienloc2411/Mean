import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => "/booking/all-bookings",
      transformResponse: (response) => {
        console.log("API Response:", response);
        return response.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Booking", id: _id })),
              { type: "Booking", id: "LIST" },
            ]
          : [{ type: "Booking", id: "LIST" }],
    }),

    getAllOwnerBookings: builder.query({
      query: () => `/booking/all-owner-bookings`,
      transformResponse: (response) => response,
      providesTags: ["Booking"],
    }),

    getBookingById: builder.query({
      query: (id) => {
        console.log("Making API request for booking ID:", id);
        return `/booking/${id}`;
      },
      transformResponse: (response, meta, arg) => {
        console.log("Raw API response for booking ID:", arg, response);

        if (!response) {
          console.error("API returned empty response for booking ID:", arg);
          return null;
        }

        if (response.data) {
          console.log("Response has data property:", response.data);
          return response.data;
        }

        console.log("Using response directly as data");
        return response;
      },
      onError: (error, arg) => {
        console.error("Error fetching booking details for ID:", arg, error);
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
        return response.bookings.flatMap((bookingWrapper) => {
          if (Array.isArray(bookingWrapper)) {
            return bookingWrapper;
          } else if (typeof bookingWrapper === "object") {
            return Object.values(bookingWrapper);
          }
          return [];
        });
      },
      providesTags: ["Booking"],
    }),
    getBookingsByRentalLocationId: builder.query({
      query: (rentalLocationId) =>
        `/booking/all-booking-in-rental-location/${rentalLocationId}`,
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
        "Booking",
      ],
    }),
    generateBookingPassword: builder.mutation({
      query: ({ bookingId, passwordRoomInput }) => ({
        url: `/booking/${bookingId}/generate-password`,
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ passwordRoomInput }),
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        { type: "Booking", id: "LIST" },
      ],
    }),

    getBoookingStatsWeekly : builder.query({
      query: (userId) => `/booking/stats/weekly-count/${userId}`,
      transformResponse: (response) => response?.weeklyBookingCounts,
      providesTags: ["Booking"],  
    }),

    getBookingStatsMonthly : builder.query({
      query: (userId) => `/booking/stats/monthly-count/${userId}`,
      transformResponse: (response) => response?.monthlyBookingCounts,
      providesTags: ["Booking"],
    }),

    getStatsRevenueWeekly : builder.query({
      query: (userId) => `/booking/stats/weekly-revenue/${userId}`,
      transformResponse: (response) => response?.weeklyRevenue,
      providesTags: ["Booking"],
    }),

    getStatsRevenueMonthly : builder.query({
      query: (userId) => `/booking/stats/monthly-revenue/${userId}`,
      transformResponse: (response) => response?.monthlyRevenue,
      providesTags: ["Booking"],
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
  useGenerateBookingPasswordMutation,
  useGetAllOwnerBookingsQuery,
  useGetBoookingStatsWeeklyQuery,
  useGetBookingStatsMonthlyQuery,
  useGetStatsRevenueWeeklyQuery,
  useGetStatsRevenueMonthlyQuery,
} = bookingApi;
