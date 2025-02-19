import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken, saveToken, removeToken } from "../../utils/storage";
import { setLogout } from "../slices/authSlice";
// import { refreshTokenSuccess, setLogout } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include", // Quan trọng: gửi cookie chứa refresh token
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const customFetchBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    (result.error && result.error.status === 401) ||
    (result.error && result.error.status === 500)
  ) {
    console.log("🔄 Token expired, trying to refresh...");

    const refreshResult = await baseQuery(
      { url: "/user/refresh", method: "GET" },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccessToken = refreshResult.data.accessToken;
      console.log(newAccessToken);

      saveToken(newAccessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLogout());

      removeToken();
    }
  }

  return result;
};
