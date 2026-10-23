import demeritApi from "../api/demeritApi";
import { toArray } from "../../../helpers/dataHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { fetchDemeritStart, fetchDemeritSuccess, fetchDemeritFailure } from "./reducer";

// Dipakai dashboard mahasiswa: daftar demerit sekaligus ringkasan kartunya.
// /ringkasan hanya boleh diakses mahasiswa, jadi untuk pembina fungsi ini dilewati.
export function asyncFetchDemerit() {
  return async (dispatch, getState) => {
    if (getState().auth.user?.role === "pembina") return;
    dispatch(fetchDemeritStart());
    try {
      const [demerit, ringkasan] = await Promise.all([
        demeritApi.getDemerit(),
        demeritApi.getRingkasan(),
      ]);
      dispatch(fetchDemeritSuccess({ demerit: toArray(demerit), ringkasan }));
    } catch (error) {
      dispatch(fetchDemeritFailure());
      await showErrorDialog(error.message);
    }
  };
}