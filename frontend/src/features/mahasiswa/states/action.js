import mahasiswaApi from "../api/mahasiswaApi";
import { toArray } from "../../../helpers/dataHelper";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import {
  fetchMahasiswaStart,
  fetchMahasiswaSuccess,
  fetchMahasiswaFailure,
  addMahasiswaStart,
  addMahasiswaSuccess,
  addMahasiswaFailure,
} from "./reducer";

export function asyncFetchMahasiswa() {
  return async (dispatch) => {
    dispatch(fetchMahasiswaStart());
    try {
      const result = await mahasiswaApi.getMahasiswa();
      dispatch(fetchMahasiswaSuccess(toArray(result)));
    } catch (error) {
      dispatch(fetchMahasiswaFailure());
      await showErrorDialog(error.message);
    }
  };
}

export function asyncAddMahasiswa({ nama, nim, password, asrama, kamar, foto }) {
  return async (dispatch) => {
    dispatch(addMahasiswaStart());
    try {
      await mahasiswaApi.addMahasiswa({ nama, nim, password, asrama, kamar, foto });
      dispatch(addMahasiswaSuccess());
      await showSuccessDialog("Mahasiswa berhasil ditambahkan.");
      await dispatch(asyncFetchMahasiswa());
      return true;
    } catch (error) {
      dispatch(addMahasiswaFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}

export function asyncUpdateKamar(id, kamar) {
  return async (dispatch) => {
    try {
      await mahasiswaApi.updateKamar(id, kamar);
      await dispatch(asyncFetchMahasiswa());
      return true;
    } catch (error) {
      await showErrorDialog(error.message);
      return false;
    }
  };
}