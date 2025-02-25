import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
    name: "staff",
    initialState: {
        staffs: [],
        selectedStaff: null,
        loading: false,
        error: null,
    },
    reducers: {
        setStaffs: (state, action) => {
            state.staffs = action.payload;
        },
        setSelectedStaff: (state, action) => {
            state.selectedStaff = action.payload;
        },
        clearSelectedStaff: (state) => {
            state.selectedStaff = null;
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
    setStaffs,
    setSelectedStaff,
    clearSelectedStaff,
    setLoading,
    setError,
} = staffSlice.actions;

export default staffSlice.reducer;