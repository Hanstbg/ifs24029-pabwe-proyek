import { describe, it, expect, vi, beforeEach } from "vitest";
import apiHelper, { getAccessToken, putAccessToken, removeAccessToken } from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("GET dengan params mengabaikan nilai kosong dan tanpa Authorization saat tidak ada token", async () => {
    await apiHelper("/pelanggaran", {
      method: "GET",
      params: { jenis: "fatal", a: "", b: null, c: undefined },
    });
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain("/api/pelanggaran?jenis=fatal");
    expect(url).not.toContain("a=");
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.body).toBeUndefined();
  });

  it("memanggil tanpa opsi menggunakan GET default", async () => {
    await apiHelper("/demerit");
    expect(global.fetch.mock.calls[0][1].method).toBe("GET");
  });

  it("menyertakan Authorization dan JSON body saat ada token", async () => {
    putAccessToken("token-1");
    await apiHelper("/auth/login", { method: "POST", body: { nim: "1001" } });
    const [, options] = global.fetch.mock.calls[0];
    expect(options.headers.Authorization).toBe("Bearer token-1");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe(JSON.stringify({ nim: "1001" }));
  });

  it("mengembalikan JSON respons saat sukses", async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ token: "t" }) });
    await expect(apiHelper("/auth/login")).resolves.toEqual({ token: "t" });
  });

  it("melempar Error dengan pesan dari field `error` saat respons gagal", async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => ({ error: "NIM atau password salah" }) });
    await expect(apiHelper("/auth/login")).rejects.toThrow("NIM atau password salah");
  });

  it("memakai pesan default saat respons gagal tanpa pesan atau bukan JSON", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("bukan json");
      },
    });
    await expect(apiHelper("/x")).rejects.toThrow("Terjadi kesalahan pada server.");
  });
});
