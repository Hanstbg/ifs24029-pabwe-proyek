import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/states/reducer";
import asramaReducer from "./features/asrama/states/reducer";
import mahasiswaReducer from "./features/mahasiswa/states/reducer";
import pelanggaranReducer from "./features/pelanggaran/states/reducer";
import demeritReducer from "./features/demerit/states/reducer";
import sanksosReducer from "./features/sanksos/states/reducer";

export const reducer = {
  auth: authReducer,
  asrama: asramaReducer,
  mahasiswa: mahasiswaReducer,
  pelanggaran: pelanggaranReducer,
  demerit: demeritReducer,
  sanksos: sanksosReducer,
};

const store = configureStore({ reducer });

export default store;