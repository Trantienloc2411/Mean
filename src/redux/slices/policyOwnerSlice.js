import { createSlice } from "@reduxjs/toolkit";

const policyOwnerSlice = createSlice({
  name: "policyOwner",
  initialState: {
    policyOwners: [],
    selectedPolicyOwner: null,
    loading: false,
    error: null,
  },
  reducers: {
    setPolicyOwners: (state, action) => {
      state.policyOwners = action.payload;
    },
    setSelectedPolicyOwner: (state, action) => {
      state.selectedPolicyOwner = action.payload;
    },
    clearSelectedPolicyOwner: (state) => {
      state.selectedPolicyOwner = null;
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
  setPolicyOwners,
  setSelectedPolicyOwner,
  clearSelectedPolicyOwner,
  setLoading,
  setError,
} = policyOwnerSlice.actions;

export default policyOwnerSlice.reducer;