import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  userId: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart(state) {
      state.loading = true;
      state.error = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    registerFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    changePasswordStart(state) {
      state.loading = true;
      state.error = null;
    },
    changePasswordSuccess(state) {
      state.loading = false;
    },
    changePasswordFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
} = authSlice.actions;

export default authSlice.reducer;
