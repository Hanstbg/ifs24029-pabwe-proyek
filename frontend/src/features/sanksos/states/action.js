import sanksosApi from "../api/sanksosApi";
import { toArray } from "../../../helpers/dataHelper";
import {
  showSuccessDialog,
  showErrorDialog,
  showPromptDialog,
} from "../../../helpers/toolsHelper";
import { asyncFetchDemerit } from "../../demerit/states/action";
import {
  fetchSanksosStart,
  fetchSanksosSuccess,
  fetchSanksosFailure,
  submitSanksosStart,
  submitSanksosSuccess,
  submitSanksosFailure,
} from "./reducer";

export function asyncFetchSanksos() {
  return async (dispatch) => {
    dispatch(fetchSanksosStart());
    try {
      const result = await sanksosApi.getSanksos();
      dispatch(fetchSanksosSuccess(toArray(result)));
    } catch (error) {
      dispatch(fetchSanksosFailure());
      await showErrorDialog(error.message);
    }
  };
}

// Mahasiswa mengajukan Sanksos untuk satu demerit, dengan catatan opsional.
export function asyncAjukanSanksos(demeritId, catatanLangsung, buktiFoto) {
  return async (dispatch) => {
    let catatan = catatanLangsung;
    if (catatan === undefined) {
      catatan = await showPromptDialog(
        "Ajukan Sanksos",
        "Catatan untuk Bapak Asrama (opsional)"
      );
      if (catatan === null) return false;
    }

    dispatch(submitSanksosStart());
    try {
      await sanksosApi.ajukanSanksos({
        demerit_id: demeritId,
        catatan,
        ...(buktiFoto ? { bukti_foto: buktiFoto } : {}),
      });
      dispatch(submitSanksosSuccess());
      await showSuccessDialog("Request Sanksos berhasil diajukan.");
      await dispatch(asyncFetchSanksos());
      await dispatch(asyncFetchDemerit());
      return true;
    } catch (error) {
      dispatch(submitSanksosFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}

const AKSI_PESAN = {
  setujui: "Request disetujui dan tugas diberikan.",
  tolak: "Request ditolak.",
  selesai: "Sanksos diverifikasi selesai.",
  dikerjakan: "Tugas ditandai sudah dikerjakan.",
};

// aksi: setujui (+tugas) | tolak | selesai | dikerjakan
export function asyncAksiSanksos(id, aksi, extra) {
  return async (dispatch) => {
    dispatch(submitSanksosStart());
    try {
      const payload = { aksi };
      if (aksi === "setujui") payload.tugas = extra;
      if (aksi === "selesai" && extra !== undefined && extra !== "") payload.poin = Number(extra);
      if (aksi === "dikerjakan" && extra) payload.bukti_selesai = extra;

      await sanksosApi.aksiSanksos(id, payload);
      dispatch(submitSanksosSuccess());
      await showSuccessDialog(AKSI_PESAN[aksi] ?? "Aksi berhasil.");
      await dispatch(asyncFetchSanksos());
      await dispatch(asyncFetchDemerit());
      return true;
    } catch (error) {
      dispatch(submitSanksosFailure());
      await showErrorDialog(error.message);
      return false;
    }
  };
}