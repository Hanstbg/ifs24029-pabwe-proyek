import { describe, it, expect } from "vitest";
import { toArray, getInitial, getRoleLabel, hasOpenSanksos } from "./dataHelper";

describe("dataHelper", () => {
  it("toArray mengembalikan array apa adanya dan [] untuk nilai lain", () => {
    expect(toArray([1, 2])).toEqual([1, 2]);
    expect(toArray(null)).toEqual([]);
    expect(toArray({ a: 1 })).toEqual([]);
  });

  it("getInitial mengambil huruf pertama dalam huruf besar", () => {
    expect(getInitial("budi")).toBe("B");
    expect(getInitial("  ani")).toBe("A");
    expect(getInitial("")).toBe("?");
    expect(getInitial(undefined)).toBe("?");
    expect(getInitial("   ")).toBe("?");
  });

  it("getRoleLabel memetakan peran ke label", () => {
    expect(getRoleLabel("pembina")).toBe("Bapak Asrama");
    expect(getRoleLabel("mahasiswa")).toBe("Mahasiswa");
    expect(getRoleLabel("lain")).toBe("Pengguna");
  });

  it("hasOpenSanksos true hanya untuk request yang masih berjalan pada demerit itu", () => {
    const list = [
      { demerit_id: 1, status: "ditolak" },
      { demerit_id: 2, status: "diajukan" },
      { demerit_id: 3, status: "selesai" },
    ];
    expect(hasOpenSanksos(list, 1)).toBe(false);
    expect(hasOpenSanksos(list, 2)).toBe(true);
    expect(hasOpenSanksos(list, 3)).toBe(false);
    expect(hasOpenSanksos(null, 2)).toBe(false);
  });
});
