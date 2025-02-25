// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getToken } from "../../utils/storage";

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_BASE_URL,
//     credentials: "include",
//     prepareHeaders: (headers) => {
//       const token = getToken();
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
// });

import { createApi } from "@reduxjs/toolkit/query/react";
import { customFetchBaseQuery } from "./customFetchBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customFetchBaseQuery, // Dùng baseQuery mới
  endpoints: () => ({}),
});
