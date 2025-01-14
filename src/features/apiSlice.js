import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // Tên reducer trong store
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL, // Base URL từ biến môi trường
    // prepareHeaders: (headers, { getState }) => {
    //   // Lấy token từ state (Redux store)
    //   const token = getState()?.auth?.token;

    //   // Nếu có token, thêm vào headers
    //   if (token) {
    //     headers.set("Authorization", `Bearer ${token}`);
    //   }

    //   return headers;
    // },
  }),
  endpoints: () => ({}), // Placeholder, các endpoint sẽ được inject
});
