import { describe, it, expect } from "vitest";
import store from "./store";

describe("store", () => {
  it("memiliki semua slice dengan state awal yang benar", () => {
    const state = store.getState();

    expect(state.auth).toEqual({ user: null, isLogin: false });
    expect(state.mahasiswa.mahasiswa).toEqual([]);
    expect(state.pelanggaran.pelanggaran).toEqual([]);
    expect(state.demerit).toMatchObject({ demerit: [], ringkasan: null });
    expect(state.sanksos.sanksos).toEqual([]);
  });
});
