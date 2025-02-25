import { createSlice } from "@reduxjs/toolkit";

const policySystemCategorySlice = createSlice({
    name: "policySystemCategory",
    initialState: {
        categories: [],
        selectedCategory: null,
        loading: false,
        error: null,
    },
    reducers: {
        setPolicySystemCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
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
    setPolicySystemCategories,
    setSelectedCategory,
    clearSelectedCategory,
    setLoading,
    setError,
} = policySystemCategorySlice.actions;

export default policySystemCategorySlice.reducer;