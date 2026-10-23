import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pelanggaran: [],
  isPelanggaran: false,
  isPelanggaranAdd: false,
};

const pelanggaranSlice = createSlice({
  name: "pelanggaran",
  initialState,
  reducers: {
    fetchPelanggaranStart(state) {
      state.isPelanggaran = true;
    },
    fetchPelanggaranSuccess(state, action) {
      state.isPelanggaran = false;
      state.pelanggaran = action.payload;
    },
    fetchPelanggaranFailure(state) {
      state.isPelanggaran = false;
    },
    addPelanggaranStart(state) {
      state.isPelanggaranAdd = true;
    },
    addPelanggaranSuccess(state) {
      state.isPelanggaranAdd = false;
    },
    addPelanggaranFailure(state) {
      state.isPelanggaranAdd = false;
    },
  },
});

export const {
  fetchPelanggaranStart,
  fetchPelanggaranSuccess,
  fetchPelanggaranFailure,
  addPelanggaranStart,
  addPelanggaranSuccess,
  addPelanggaranFailure,
} = pelanggaranSlice.actions;

export default pelanggaranSlice.reducer;
