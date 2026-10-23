import { describe, it, expect, vi, afterEach } from "vitest";
import apiHelper from "../helpers/apiHelper";
import mahasiswaApi from "./mahasiswa/api/mahasiswaApi";
import pelanggaranApi from "./pelanggaran/api/pelanggaranApi";
import demeritApi from "./demerit/api/demeritApi";
import sanksosApi from "./sanksos/api/sanksosApi";

vi.mock("../helpers/apiHelper", () => ({ default: vi.fn().mockResolvedValue({}) }));

describe("modul api per fitur", () => {
  afterEach(() => vi.clearAllMocks());

  it("mahasiswaApi", async () => {
    await mahasiswaApi.getMahasiswa();
    expect(apiHelper).toHaveBeenCalledWith("/mahasiswa", { method: "GET" });
    await mahasiswaApi.addMahasiswa({ nama: "A" });
    expect(apiHelper).toHaveBeenCalledWith("/mahasiswa", { method: "POST", body: { nama: "A" } });
  });

  it("pelanggaranApi", async () => {
    await pelanggaranApi.getPelanggaran();
    expect(apiHelper).toHaveBeenCalledWith("/pelanggaran", { method: "GET" });
    await pelanggaranApi.addPelanggaran({ jenis: "fatal" });
    expect(apiHelper).toHaveBeenCalledWith("/pelanggaran", { method: "POST", body: { jenis: "fatal" } });
  });

  it("demeritApi", async () => {
    await demeritApi.getDemerit();
    expect(apiHelper).toHaveBeenCalledWith("/demerit", { method: "GET" });
    await demeritApi.getRingkasan();
    expect(apiHelper).toHaveBeenCalledWith("/ringkasan", { method: "GET" });
  });

  it("sanksosApi", async () => {
    await sanksosApi.getSanksos();
    expect(apiHelper).toHaveBeenCalledWith("/sanksos", { method: "GET" });
    await sanksosApi.ajukanSanksos({ demerit_id: 1 });
    expect(apiHelper).toHaveBeenCalledWith("/sanksos", { method: "POST", body: { demerit_id: 1 } });
    await sanksosApi.aksiSanksos(4, { aksi: "tolak" });
    expect(apiHelper).toHaveBeenCalledWith("/sanksos/4", { method: "PATCH", body: { aksi: "tolak" } });
  });
});
