import { createSlice } from "@reduxjs/toolkit";

const accommodationSlice = createSlice({
  name: "accommodation",
  initialState: {
    accommodations: [],
    selectedAccommodation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAccommodations: (state, action) => {
      state.accommodations = action.payload;
    },
    setSelectedAccommodation: (state, action) => {
      state.selectedAccommodation = action.payload;
    },
    clearSelectedAccommodation: (state) => {
      state.selectedAccommodation = null;
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
  setAccommodations,
  setSelectedAccommodation,
  clearSelectedAccommodation,
  setLoading,
  setError,
} = accommodationSlice.actions;

export default accommodationSlice.reducer;
