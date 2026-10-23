import { createSlice } from "@reduxjs/toolkit";

const asramaSlice = createSlice({
  name: "asrama",
  initialState: { list: [], loading: false },
  reducers: {
    fetchAsramaStart(state) {
      state.loading = true;
    },
    fetchAsramaSuccess(state, action) {
      state.loading = false;
      state.list = action.payload;
    },
    fetchAsramaFailure(state) {
      state.loading = false;
    },
  },
});

export const { fetchAsramaStart, fetchAsramaSuccess, fetchAsramaFailure } = asramaSlice.actions;

export default asramaSlice.reducer;