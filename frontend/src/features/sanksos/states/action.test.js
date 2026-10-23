import { describe, it, expect, vi, afterEach } from "vitest";
import sanksosApi from "../api/sanksosApi";
import {
  showSuccessDialog,
  showErrorDialog,
  showPromptDialog,
} from "../../../helpers/toolsHelper";
import { asyncFetchSanksos, asyncAjukanSanksos, asyncAksiSanksos } from "./action";
import reducer, {
  fetchSanksosStart,
  fetchSanksosSuccess,
  fetchSanksosFailure,
  submitSanksosStart,
  submitSanksosSuccess,
  submitSanksosFailure,
} from "./reducer";

vi.mock("../api/sanksosApi", () => ({
  default: { getSanksos: vi.fn(), ajukanSanksos: vi.fn(), aksiSanksos: vi.fn() },
}));
vi.mock("../../demerit/states/action", () => ({
  asyncFetchDemerit: vi.fn(() => ({ type: "mock/fetchDemerit" })),
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn().mockResolvedValue(true),
  showPromptDialog: vi.fn(),
}));

describe("sanksos reducer", () => {
  it("mengatur daftar dan flag", () => {
    const initial = { sanksos: [], isSanksos: false, isSanksosSubmit: false };
    const loading = reducer(initial, fetchSanksosStart());
    expect(loading.isSanksos).toBe(true);
    expect(reducer(loading, fetchSanksosSuccess([{ id: 1 }]))).toMatchObject({
      isSanksos: false,
      sanksos: [{ id: 1 }],
    });
    expect(reducer(loading, fetchSanksosFailure()).isSanksos).toBe(false);

    const submitting = reducer(initial, submitSanksosStart());
    expect(submitting.isSanksosSubmit).toBe(true);
    expect(reducer(submitting, submitSanksosSuccess()).isSanksosSubmit).toBe(false);
    expect(reducer(submitting, submitSanksosFailure()).isSanksosSubmit).toBe(false);
  });
});

describe("sanksos async actions", () => {
  afterEach(() => vi.clearAllMocks());

  it("asyncFetchSanksos sukses dan gagal", async () => {
    sanksosApi.getSanksos.mockResolvedValueOnce([{ id: 1 }]);
    const dispatch = vi.fn();
    await asyncFetchSanksos()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchSanksosSuccess([{ id: 1 }]));

    sanksosApi.getSanksos.mockRejectedValueOnce(new Error("gagal"));
    await asyncFetchSanksos()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchSanksosFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncAjukanSanksos dibatalkan: tidak memanggil API, return false", async () => {
    showPromptDialog.mockResolvedValue(null);
    const dispatch = vi.fn();
    const result = await asyncAjukanSanksos(3)(dispatch);
    expect(sanksosApi.ajukanSanksos).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it("asyncAjukanSanksos sukses: kirim demerit_id dan catatan", async () => {
    showPromptDialog.mockResolvedValue("tolong ya");
    sanksosApi.ajukanSanksos.mockResolvedValue({ id: 1 });
    const dispatch = vi.fn();
    const result = await asyncAjukanSanksos(3)(dispatch);
    expect(sanksosApi.ajukanSanksos).toHaveBeenCalledWith({ demerit_id: 3, catatan: "tolong ya" });
    expect(dispatch).toHaveBeenCalledWith(submitSanksosSuccess());
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it("asyncAjukanSanksos gagal: tampilkan error, return false", async () => {
    showPromptDialog.mockResolvedValue("");
    sanksosApi.ajukanSanksos.mockRejectedValue(new Error("Sudah ada request"));
    const dispatch = vi.fn();
    const result = await asyncAjukanSanksos(3)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(submitSanksosFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("Sudah ada request");
    expect(result).toBe(false);
  });

  it("asyncAksiSanksos sukses: kirim aksi dan tugas, muat ulang data", async () => {
    sanksosApi.aksiSanksos.mockResolvedValue({ status: "disetujui" });
    const dispatch = vi.fn();
    const result = await asyncAksiSanksos(9, "setujui", "bersihkan selasar")(dispatch);
    expect(sanksosApi.aksiSanksos).toHaveBeenCalledWith(9, { aksi: "setujui", tugas: "bersihkan selasar" });
    expect(showSuccessDialog).toHaveBeenCalledWith("Request disetujui dan tugas diberikan.");
    expect(dispatch).toHaveBeenCalledWith({ type: "mock/fetchDemerit" });
    expect(result).toBe(true);
  });

  it("asyncAksiSanksos dengan aksi tak dikenal memakai pesan umum", async () => {
    sanksosApi.aksiSanksos.mockResolvedValue({});
    await asyncAksiSanksos(9, "lain")(vi.fn());
    expect(showSuccessDialog).toHaveBeenCalledWith("Aksi berhasil.");
  });

  it("asyncAksiSanksos gagal: return false", async () => {
    sanksosApi.aksiSanksos.mockRejectedValue(new Error("Aksi tidak valid"));
    const dispatch = vi.fn();
    const result = await asyncAksiSanksos(9, "selesai")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(submitSanksosFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("Aksi tidak valid");
    expect(result).toBe(false);
  });
});
