import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, // Thông tin người dùng hiện tại
  isLoggedIn: false, // Trạng thái đăng nhập
  error: null, // Lưu lỗi liên quan đến người dùng (nếu có)
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setError } = userSlice.actions;

export default userSlice.reducer;
