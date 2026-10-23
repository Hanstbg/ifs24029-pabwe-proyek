import { describe, it, expect, vi, afterEach } from "vitest";
import mahasiswaApi from "../api/mahasiswaApi";
import { showSuccessDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncFetchMahasiswa, asyncAddMahasiswa } from "./action";
import reducer, {
  fetchMahasiswaStart,
  fetchMahasiswaSuccess,
  fetchMahasiswaFailure,
  addMahasiswaStart,
  addMahasiswaSuccess,
  addMahasiswaFailure,
} from "./reducer";

vi.mock("../api/mahasiswaApi", () => ({
  default: { getMahasiswa: vi.fn(), addMahasiswa: vi.fn() },
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue(true),
  showErrorDialog: vi.fn().mockResolvedValue(true),
}));

describe("mahasiswa reducer", () => {
  it("mengatur daftar dan flag loading", () => {
    const initial = { mahasiswa: [], isMahasiswa: false, isMahasiswaAdd: false };
    const loading = reducer(initial, fetchMahasiswaStart());
    expect(loading.isMahasiswa).toBe(true);
    const loaded = reducer(loading, fetchMahasiswaSuccess([{ id: 1 }]));
    expect(loaded).toMatchObject({ isMahasiswa: false, mahasiswa: [{ id: 1 }] });
    expect(reducer(loading, fetchMahasiswaFailure()).isMahasiswa).toBe(false);

    const adding = reducer(initial, addMahasiswaStart());
    expect(adding.isMahasiswaAdd).toBe(true);
    expect(reducer(adding, addMahasiswaSuccess()).isMahasiswaAdd).toBe(false);
    expect(reducer(adding, addMahasiswaFailure()).isMahasiswaAdd).toBe(false);
  });
});

describe("mahasiswa async actions", () => {
  afterEach(() => vi.clearAllMocks());

  it("asyncFetchMahasiswa sukses: dispatch daftar", async () => {
    mahasiswaApi.getMahasiswa.mockResolvedValue([{ id: 1 }]);
    const dispatch = vi.fn();
    await asyncFetchMahasiswa()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchMahasiswaStart());
    expect(dispatch).toHaveBeenCalledWith(fetchMahasiswaSuccess([{ id: 1 }]));
  });

  it("asyncFetchMahasiswa gagal: dispatch failure dan tampilkan error", async () => {
    mahasiswaApi.getMahasiswa.mockRejectedValue(new Error("Hanya untuk pembina"));
    const dispatch = vi.fn();
    await asyncFetchMahasiswa()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchMahasiswaFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("Hanya untuk pembina");
  });

  it("asyncAddMahasiswa sukses: dialog sukses, muat ulang, return true", async () => {
    mahasiswaApi.addMahasiswa.mockResolvedValue({ id: 5 });
    const dispatch = vi.fn();
    const result = await asyncAddMahasiswa({ nama: "A", nim: "1", password: "p" })(dispatch);
    expect(mahasiswaApi.addMahasiswa).toHaveBeenCalledWith({ nama: "A", nim: "1", password: "p" });
    expect(dispatch).toHaveBeenCalledWith(addMahasiswaStart());
    expect(dispatch).toHaveBeenCalledWith(addMahasiswaSuccess());
    expect(showSuccessDialog).toHaveBeenCalled();
    // start, success, lalu thunk muat ulang daftar mahasiswa
    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenLastCalledWith(expect.any(Function));
    expect(result).toBe(true);
  });

  it("asyncAddMahasiswa gagal: dispatch failure dan return false", async () => {
    mahasiswaApi.addMahasiswa.mockRejectedValue(new Error("NIM sudah terdaftar"));
    const dispatch = vi.fn();
    const result = await asyncAddMahasiswa({ nama: "A", nim: "1", password: "p" })(dispatch);
    expect(dispatch).toHaveBeenCalledWith(addMahasiswaFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("NIM sudah terdaftar");
    expect(result).toBe(false);
  });
});
