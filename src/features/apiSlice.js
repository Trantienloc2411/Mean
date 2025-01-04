import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // Tên reducer trong store
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, // Base URL từ biến môi trường
  }),
  endpoints: () => ({}), // Placeholder, các endpoint sẽ được inject
});
