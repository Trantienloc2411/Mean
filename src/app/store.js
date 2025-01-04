import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Thêm reducer từ apiSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Thêm middleware của RTK Query
});
