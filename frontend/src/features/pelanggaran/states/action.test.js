import { describe, it, expect, vi, afterEach } from "vitest";
import pelanggaranApi from "../api/pelanggaranApi";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncFetchPelanggaran, asyncAddPelanggaran } from "./action";
import reducer, {
  fetchPelanggaranStart,
  fetchPelanggaranSuccess,
  fetchPelanggaranFailure,
  addPelanggaranStart,
  addPelanggaranSuccess,
  addPelanggaranFailure,
} from "./reducer";

vi.mock("../api/pelanggaranApi", () => ({
  default: { getPelanggaran: vi.fn(), addPelanggaran: vi.fn() },
}));
vi.mock("../../mahasiswa/states/action", () => ({
  asyncFetchMahasiswa: vi.fn(() => ({ type: "mock/fetchMahasiswa" })),
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn().mockResolvedValue(true),
}));

describe("pelanggaran reducer", () => {
  it("mengatur daftar dan flag loading", () => {
    const initial = { pelanggaran: [], isPelanggaran: false, isPelanggaranAdd: false };
    const loading = reducer(initial, fetchPelanggaranStart());
    expect(loading.isPelanggaran).toBe(true);
    expect(reducer(loading, fetchPelanggaranSuccess([{ id: 1 }]))).toMatchObject({
      isPelanggaran: false,
      pelanggaran: [{ id: 1 }],
    });
    expect(reducer(loading, fetchPelanggaranFailure()).isPelanggaran).toBe(false);

    const adding = reducer(initial, addPelanggaranStart());
    expect(adding.isPelanggaranAdd).toBe(true);
    expect(reducer(adding, addPelanggaranSuccess()).isPelanggaranAdd).toBe(false);
    expect(reducer(adding, addPelanggaranFailure()).isPelanggaranAdd).toBe(false);
  });
});

describe("pelanggaran async actions", () => {
  afterEach(() => vi.clearAllMocks());

  it("asyncFetchPelanggaran sukses dan gagal", async () => {
    pelanggaranApi.getPelanggaran.mockResolvedValueOnce([{ id: 1 }]);
    const dispatch = vi.fn();
    await asyncFetchPelanggaran()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchPelanggaranSuccess([{ id: 1 }]));

    pelanggaranApi.getPelanggaran.mockRejectedValueOnce(new Error("gagal"));
    await asyncFetchPelanggaran()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchPelanggaranFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
  });

  it("asyncAddPelanggaran: kirim user_id sebagai angka dan sebutkan demerit baru", async () => {
    pelanggaranApi.addPelanggaran.mockResolvedValue({
      demeritBaru: [{ jenis: "kuning" }, { jenis: "merah" }],
    });
    const dispatch = vi.fn();
    const result = await asyncAddPelanggaran({ user_id: "7", jenis: "peringatan", deskripsi: "Telat" })(dispatch);
    expect(pelanggaranApi.addPelanggaran).toHaveBeenCalledWith({
      user_id: 7,
      jenis: "peringatan",
      deskripsi: "Telat",
    });
    expect(dispatch).toHaveBeenCalledWith(addPelanggaranStart());
    expect(dispatch).toHaveBeenCalledWith(addPelanggaranSuccess());
    expect(showSuccessDialog).toHaveBeenCalledWith(expect.stringContaining("demerit KUNING + demerit MERAH"));
    expect(result).toBe(true);
  });

  it("asyncAddPelanggaran tanpa demerit baru: pesan peringatan tercatat", async () => {
    pelanggaranApi.addPelanggaran.mockResolvedValue({});
    const dispatch = vi.fn();
    await asyncAddPelanggaran({ user_id: 1, jenis: "peringatan", deskripsi: "x" })(dispatch);
    expect(showSuccessDialog).toHaveBeenCalledWith("Peringatan tercatat.");
  });

  it("asyncAddPelanggaran gagal: return false", async () => {
    pelanggaranApi.addPelanggaran.mockRejectedValue(new Error("Mahasiswa tidak ditemukan"));
    const dispatch = vi.fn();
    const result = await asyncAddPelanggaran({ user_id: 1, jenis: "fatal", deskripsi: "x" })(dispatch);
    expect(dispatch).toHaveBeenCalledWith(addPelanggaranFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("Mahasiswa tidak ditemukan");
    expect(result).toBe(false);
  });
});
