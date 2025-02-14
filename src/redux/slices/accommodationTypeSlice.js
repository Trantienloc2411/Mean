import { createSlice } from "@reduxjs/toolkit";
const accommodationTypeSlice = createSlice({
    name: "accommodationType",
    initialState: {
        types: [],
        selectedType: null,
        loading: false,
        error: null,
    },
    reducers: {
        setAccommodationTypes: (state, action) => {
            state.types = action.payload;
        },
        setSelectedType: (state, action) => {
            state.selectedType = action.payload;
        },
        clearSelectedType: (state) => {
            state.selectedType = null;
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
    setAccommodationTypes,
    setSelectedType,
    clearSelectedType,
    setLoading,
    setError,
} = accommodationTypeSlice.actions;

export default accommodationTypeSlice.reducer;