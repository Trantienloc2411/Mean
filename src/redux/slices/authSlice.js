  import { createSlice } from "@reduxjs/toolkit";
  import { getRole, getToken, getUserId, removeToken } from "../../utils/storage";

  const initialState = {
    token: getToken(),
    userId: getUserId(),
    isAuthenticated: !!getToken(),
    user: null,
    role: getRole(),
  };

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setCredentials: (state, action) => {
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.userId = action.payload._id;
      },
      setUser: (state, action) => {
        state.user = action.payload;
      },
      setRole: (state, action) => {
        state.role = action.payload;
      },
      setLogout: (state) => {
        removeToken();
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
      },
    },
  });

  export const { setCredentials, setUser, setRole, setLogout } =
    authSlice.actions;
  export default authSlice.reducer;
