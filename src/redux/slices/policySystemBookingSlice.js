import { createSlice } from "@reduxjs/toolkit";

const policySystemBookingSlice = createSlice({
    name: "policySystemBooking",
    initialState: {
        bookings: [],
        selectedBooking: null,
        loading: false,
        error: null,
    },
    reducers: {
        setPolicySystemBookings: (state, action) => {
            state.bookings = action.payload;
        },
        setSelectedBooking: (state, action) => {
            state.selectedBooking = action.payload;
        },
        clearSelectedBooking: (state) => {
            state.selectedBooking = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setPolicySystemBookings,
    setSelectedBooking,
    clearSelectedBooking,
    setLoading,
    setError,
} = policySystemBookingSlice.actions;

export default policySystemBookingSlice.reducer;