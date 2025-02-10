import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
    name: "service",
    initialState: {
        services: [],
        selectedService: null,
        loading: false,
        error: null,
    },
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload;
        },
        setSelectedService: (state, action) => {
            state.selectedService = action.payload;
        },
        clearSelectedService: (state) => {
            state.selectedService = null;
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
    setServices,
    setSelectedService,
    clearSelectedService,
    setLoading,
    setError,
} = serviceSlice.actions;

export default serviceSlice.reducer;