import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./services/apiSlice";
import authReducer from "./slices/authSlice";
import accommodationTypeReducer from "./slices/accommodationTypeSlice";
import serviceReducer from "./slices/serviceSlice";
import rentalLocationReducer from "./slices/rentalLocationSlice";
import businessInformationReducer from "./slices/businessInformationSlice";
import policySystemReducer from "./slices/policySystemSlice";
import staffReducer from "./slices/staffSlice";
import policySystemCategoryReducer from "./slices/policySystemCategorySlice";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        accommodationType: accommodationTypeReducer,
        service: serviceReducer,
        rentalLocation: rentalLocationReducer,
        businessInformation: businessInformationReducer,
        policySystem: policySystemReducer,
        staff: staffReducer,
        policySystemCategory: policySystemCategoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
