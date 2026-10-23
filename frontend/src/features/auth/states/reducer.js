import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.isLogin = true;
    },
    loginSuccess(state) {
      state.isLogin = false;
    },
    loginFailure(state) {
      state.isLogin = false;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
