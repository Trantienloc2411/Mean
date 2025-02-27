import { createSlice } from "@reduxjs/toolkit";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    selectedFeedback: null,
    loading: false,
    error: null,
  },
  reducers: {
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },
    setSelectedFeedback: (state, action) => {
      state.selectedFeedback = action.payload;
    },
    clearSelectedFeedback: (state) => {
      state.selectedFeedback = null;
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
  setFeedbacks,
  setSelectedFeedback,
  clearSelectedFeedback,
  setLoading,
  setError,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;