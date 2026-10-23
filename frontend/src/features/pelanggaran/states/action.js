import pelanggaranApi from "../api/pelanggaranApi";
import { toArray } from "../../../helpers/dataHelper";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncFetchMahasiswa } from "../../mahasiswa/states/action";
import {
  fetchPelanggaranStart,
  fetchPelanggaranSuccess,
  fetchPelanggaranFailure,
  addPelanggaranStart,
  addPelanggaranSuccess,
  addPelanggaranFailure,
} from "./reducer";

export function asyncFetchPelanggaran() {
  return async (dispatch) => {
    dispatch(fetchPelanggaranStart());
    try {
      const result = await pelanggaranApi.getPelanggaran();
      dispatch(fetchPelanggaranSuccess(toArray(result)));
    } catch (error) {
      dispatch(fetchPelanggaranFailure());
      await showErrorDialog(error.message);
    }
  };
}

export function asyncAddPelanggaran({ user_id, jenis, deskripsi, poin }) {
  return async (dispatch) => {
    dispatch(addPelanggaranStart());
    try {
      const result = await pelanggaranApi.addPelanggaran({
        user_id: Number(user_id),
        jenis,
        deskripsi,
        poin: poin ? Number(poin) : undefined,
      });
      dispatch(addPelanggaranSuccess());

      const baru = toArray(result?.demeritBaru)
        .map((item) => `demerit ${String(item.jenis).toUpperCase()}`)
        .join(" + ");
      await showSuccessDialog(
        baru ? `Pelanggaran tercatat. Otomatis terbit: ${baru}.` : "Peringatan tercatat."
      );

      await dispatch(asyncFetchPelanggaran());
      await dispatch(asyncFetchMahasiswa());
      return true;
    } catch (error) {
      dispatch(addPelanggaranFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}
