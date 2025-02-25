import { createSlice } from "@reduxjs/toolkit";

const policySystemSlice = createSlice({
    name: "policySystem",
    initialState: {
        policySystems: [],
        selectedPolicySystem: null,
        loading: false,
        error: null,
    },
    reducers: {
        setPolicySystems: (state, action) => {
            state.policySystems = action.payload;
        },
        setSelectedPolicySystem: (state, action) => {
            state.selectedPolicySystem = action.payload;
        },
        clearSelectedPolicySystem: (state) => {
            state.selectedPolicySystem = null;
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
    setPolicySystems,
    setSelectedPolicySystem,
    clearSelectedPolicySystem,
    setLoading,
    setError,
} = policySystemSlice.actions;

export default policySystemSlice.reducer;