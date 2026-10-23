import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mahasiswa: [],
  isMahasiswa: false,
  isMahasiswaAdd: false,
};

const mahasiswaSlice = createSlice({
  name: "mahasiswa",
  initialState,
  reducers: {
    fetchMahasiswaStart(state) {
      state.isMahasiswa = true;
    },
    fetchMahasiswaSuccess(state, action) {
      state.isMahasiswa = false;
      state.mahasiswa = action.payload;
    },
    fetchMahasiswaFailure(state) {
      state.isMahasiswa = false;
    },
    addMahasiswaStart(state) {
      state.isMahasiswaAdd = true;
    },
    addMahasiswaSuccess(state) {
      state.isMahasiswaAdd = false;
    },
    addMahasiswaFailure(state) {
      state.isMahasiswaAdd = false;
    },
  },
});

export const {
  fetchMahasiswaStart,
  fetchMahasiswaSuccess,
  fetchMahasiswaFailure,
  addMahasiswaStart,
  addMahasiswaSuccess,
  addMahasiswaFailure,
} = mahasiswaSlice.actions;

export default mahasiswaSlice.reducer;
