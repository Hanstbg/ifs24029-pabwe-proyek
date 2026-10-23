import { describe, it, expect, vi, afterEach } from "vitest";

const fire = vi.fn();
vi.mock("sweetalert2", () => ({ default: { fire: (...args) => fire(...args) } }));

import {
  showSuccessDialog,
  showErrorDialog,
  showConfirmDialog,
  showPromptDialog,
  formatDate,
} from "./toolsHelper";

describe("toolsHelper", () => {
  afterEach(() => fire.mockReset());

  it("showSuccessDialog menampilkan dialog sukses", async () => {
    fire.mockResolvedValue({});
    await showSuccessDialog("Tersimpan");
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", text: "Tersimpan" }));
  });

  it("showErrorDialog menampilkan dialog error", async () => {
    fire.mockResolvedValue({});
    await showErrorDialog("Gagal");
    expect(fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "Gagal" }));
  });

  it("showConfirmDialog mengembalikan status konfirmasi", async () => {
    fire.mockResolvedValue({ isConfirmed: true });
    await expect(showConfirmDialog("Yakin?")).resolves.toBe(true);
    fire.mockResolvedValue({ isConfirmed: false });
    await expect(showConfirmDialog("Yakin?")).resolves.toBe(false);
  });

  it("showPromptDialog mengembalikan teks, string kosong, atau null saat batal", async () => {
    fire.mockResolvedValue({ isConfirmed: true, value: "catatan" });
    await expect(showPromptDialog("Judul", "hint")).resolves.toBe("catatan");
    fire.mockResolvedValue({ isConfirmed: true, value: undefined });
    await expect(showPromptDialog("Judul")).resolves.toBe("");
    fire.mockResolvedValue({ isConfirmed: false });
    await expect(showPromptDialog("Judul")).resolves.toBeNull();
  });

  it("formatDate memformat tanggal SQLite (UTC) dan tanggal ISO", () => {
    expect(formatDate("2026-10-21 03:00:00")).toMatch(/2026/);
    expect(formatDate("2026-10-21T03:00:00Z")).toMatch(/2026/);
  });

  it("formatDate mengembalikan '-' untuk nilai kosong atau tidak valid", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("")).toBe("-");
    expect(formatDate("bukan tanggal")).toBe("-");
  });
});
