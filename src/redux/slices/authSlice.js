import { createSlice } from "@reduxjs/toolkit";
import { getRole, getToken, getUserId, removeToken } from "../../utils/storage";

const initialState = {
  token: getToken(),
  userId: getUserId(), // Ban đầu không có user
  isAuthenticated: !!getToken(),
  user: null, // Ban đầu không có user
  role: getRole(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.userId = action.payload._id; // Lưu thông tin user vào Redux
    },
    setUser: (state, action) => {
      state.user = action.payload; // Cập nhật user khi cần
    },
    setRole: (state, action) => {
      state.role = action.payload; // Cập nhật user khi cần
    },
    logout: (state) => {
      removeToken();
      state.token = null;
      state.isAuthenticated = false;
      state.user = null; // Xóa thông tin user khi logout
      state.role = null; // Xóa thông tin user khi logout
    },
  },
});

export const { setCredentials, setUser, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
