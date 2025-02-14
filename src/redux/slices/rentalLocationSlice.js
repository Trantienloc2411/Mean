import { createSlice } from "@reduxjs/toolkit";

const rentalLocationSlice = createSlice({
  name: "rentalLocation",
  initialState: {
    rentalLocations: [],
    selectedRentalLocation: null,
    loading: false,
    error: null,
  },
  reducers: {
    setRentalLocations: (state, action) => {
      state.rentalLocations = action.payload;
    },
    setSelectedRentalLocation: (state, action) => {
      state.selectedRentalLocation = action.payload;
    },
    clearSelectedRentalLocation: (state) => {
      state.selectedRentalLocation = null;
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
  setRentalLocations,
  setSelectedRentalLocation,
  clearSelectedRentalLocation,
  setLoading,
  setError,
} = rentalLocationSlice.actions;

export default rentalLocationSlice.reducer;
