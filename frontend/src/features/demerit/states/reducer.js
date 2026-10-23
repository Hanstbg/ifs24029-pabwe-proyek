import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  demerit: [],
  ringkasan: null,
  isDemerit: false,
};

const demeritSlice = createSlice({
  name: "demerit",
  initialState,
  reducers: {
    fetchDemeritStart(state) {
      state.isDemerit = true;
    },
    fetchDemeritSuccess(state, action) {
      state.isDemerit = false;
      state.demerit = action.payload.demerit;
      state.ringkasan = action.payload.ringkasan;
    },
    fetchDemeritFailure(state) {
      state.isDemerit = false;
    },
  },
});

export const { fetchDemeritStart, fetchDemeritSuccess, fetchDemeritFailure } = demeritSlice.actions;

export default demeritSlice.reducer;
