import { describe, it, expect, vi, afterEach } from "vitest";
import demeritApi from "../api/demeritApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncFetchDemerit } from "./action";
import reducer, { fetchDemeritStart, fetchDemeritSuccess, fetchDemeritFailure } from "./reducer";

vi.mock("../api/demeritApi", () => ({
  default: { getDemerit: vi.fn(), getRingkasan: vi.fn() },
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn().mockResolvedValue(true),
}));

describe("demerit reducer", () => {
  it("menyimpan demerit dan ringkasan", () => {
    const initial = { demerit: [], ringkasan: null, isDemerit: false };
    const loading = reducer(initial, fetchDemeritStart());
    expect(loading.isDemerit).toBe(true);
    const ring = { peringatan_berjalan: 1, kuning_aktif: 0, merah_aktif: 0 };
    expect(reducer(loading, fetchDemeritSuccess({ demerit: [{ id: 1 }], ringkasan: ring }))).toEqual({
      demerit: [{ id: 1 }],
      ringkasan: ring,
      isDemerit: false,
    });
    expect(reducer(loading, fetchDemeritFailure()).isDemerit).toBe(false);
  });
});

describe("asyncFetchDemerit", () => {
  afterEach(() => vi.clearAllMocks());

  it("sukses: mengambil demerit dan ringkasan sekaligus", async () => {
    const ring = { peringatan_berjalan: 2, kuning_aktif: 1, merah_aktif: 0 };
    demeritApi.getDemerit.mockResolvedValue([{ id: 1 }]);
    demeritApi.getRingkasan.mockResolvedValue(ring);
    const dispatch = vi.fn();
    await asyncFetchDemerit()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchDemeritSuccess({ demerit: [{ id: 1 }], ringkasan: ring }));
  });

  it("gagal: dispatch failure dan tampilkan error", async () => {
    demeritApi.getDemerit.mockRejectedValue(new Error("Belum login"));
    demeritApi.getRingkasan.mockResolvedValue({});
    const dispatch = vi.fn();
    await asyncFetchDemerit()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(fetchDemeritFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("Belum login");
  });
});
