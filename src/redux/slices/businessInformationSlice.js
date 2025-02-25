import { createSlice } from "@reduxjs/toolkit";

const businessInformationSlice = createSlice({
    name: "businessInformation",
    initialState: {
        businessInfos: [],
        selectedBusinessInfo: null,
        loading: false,
        error: null,
    },
    reducers: {
        setBusinessInformations: (state, action) => {
            state.businessInfos = action.payload;
        },
        setSelectedBusinessInfo: (state, action) => {
            state.selectedBusinessInfo = action.payload;
        },
        clearSelectedBusinessInfo: (state) => {
            state.selectedBusinessInfo = null;
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
    setBusinessInformations,
    setSelectedBusinessInfo,
    clearSelectedBusinessInfo,
    setLoading,
    setError,
} = businessInformationSlice.actions;

export default businessInformationSlice.reducer;