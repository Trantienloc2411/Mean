import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        selectedNotification: null,
        loading: false,
        error: null,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setSelectedNotification: (state, action) => {
            state.selectedNotification = action.payload;
        },
        clearSelectedNotification: (state) => {
            state.selectedNotification = null;
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
    setNotifications,
    setSelectedNotification,
    clearSelectedNotification,
    setLoading,
    setError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
