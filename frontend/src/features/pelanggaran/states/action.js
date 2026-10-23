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

export function asyncAddPelanggaran({ user_id, asrama, kamar, jenis, deskripsi, poin }) {
  return async (dispatch) => {
    dispatch(addPelanggaranStart());
    try {
      const payload = { jenis, deskripsi, poin: poin ? Number(poin) : undefined };
      if (kamar) {
        payload.asrama = asrama;
        payload.kamar = kamar;
      } else {
        payload.user_id = Number(user_id);
      }
      const result = await pelanggaranApi.addPelanggaran(payload);
      dispatch(addPelanggaranSuccess());

      let pesan;
      if (kamar) {
        const perOrang = toArray(result?.hasil)
          .filter((h) => toArray(h.demeritBaru).length > 0)
          .map((h) => `${h.nama}: ${toArray(h.demeritBaru).map((d) => String(d.jenis).toUpperCase()).join(" + ")}`)
          .join("; ");
        pesan = `Pencatatan untuk kamar ${kamar} berhasil (${result?.jumlah ?? 0} penghuni).`;
        if (perOrang) pesan += ` Demerit otomatis terbit -> ${perOrang}.`;
      } else {
        const baru = toArray(result?.demeritBaru)
          .map((item) => `demerit ${String(item.jenis).toUpperCase()}`)
          .join(" + ");
        pesan = baru ? `Pelanggaran tercatat. Otomatis terbit: ${baru}.` : "Peringatan tercatat.";
      }
      await showSuccessDialog(pesan);

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