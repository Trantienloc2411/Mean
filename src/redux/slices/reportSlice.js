import { createSlice } from "@reduxjs/toolkit";

const reportSlice = createSlice({
  name: "report",
  initialState: {
    reports: [],
    selectedReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
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
  setReports,
  setSelectedReport,
  clearSelectedReport,
  setLoading,
  setError,
} = reportSlice.actions;

export default reportSlice.reducer;