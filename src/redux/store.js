import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./slices/authSlice";
import accommodationTypeReducer from "./slices/accommodationTypeSlice";
import serviceReducer from "./slices/serviceSlice";
import rentalLocationReducer from "./slices/rentalLocationSlice";

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        accommodationType: accommodationTypeReducer,
        service: serviceReducer,
        rentalLocation: rentalLocationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
