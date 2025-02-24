import { apiSlice } from "./apiSlice";

export const policySystemBookingApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPolicySystemBookings: builder.query({
            query: () => "/policy-system-booking/all-policy-system-bookings",
            providesTags: ["PolicySystemBooking"],
        }),

        getPolicySystemBookingById: builder.query({
            query: (id) => `/policy-system-booking/${id}`,
            providesTags: ["PolicySystemBooking"],
        }),

        createPolicySystemBooking: builder.mutation({
            query: (booking) => ({
                url: "/policy-system-booking/create-policy-system-booking",
                method: "POST",
                body: booking,
            }),
            invalidatesTags: ["PolicySystemBooking"],
        }),

        updatePolicySystemBooking: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/policy-system-booking/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["PolicySystemBooking"],
        }),
    }),
});

export const {
    useGetAllPolicySystemBookingsQuery,
    useGetPolicySystemBookingByIdQuery,
    useCreatePolicySystemBookingMutation,
    useUpdatePolicySystemBookingMutation,
} = policySystemBookingApi;