import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sanksos: [],
  isSanksos: false,
  isSanksosSubmit: false,
};

const sanksosSlice = createSlice({
  name: "sanksos",
  initialState,
  reducers: {
    fetchSanksosStart(state) {
      state.isSanksos = true;
    },
    fetchSanksosSuccess(state, action) {
      state.isSanksos = false;
      state.sanksos = action.payload;
    },
    fetchSanksosFailure(state) {
      state.isSanksos = false;
    },
    submitSanksosStart(state) {
      state.isSanksosSubmit = true;
    },
    submitSanksosSuccess(state) {
      state.isSanksosSubmit = false;
    },
    submitSanksosFailure(state) {
      state.isSanksosSubmit = false;
    },
  },
});

export const {
  fetchSanksosStart,
  fetchSanksosSuccess,
  fetchSanksosFailure,
  submitSanksosStart,
  submitSanksosSuccess,
  submitSanksosFailure,
} = sanksosSlice.actions;

export default sanksosSlice.reducer;
