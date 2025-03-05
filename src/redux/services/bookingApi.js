import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
        query: () => "/booking/all-bookings",
        providesTags: ["Booking"],
    }),
  }),
});

export const { useGetBookingsQuery } = bookingApi;

