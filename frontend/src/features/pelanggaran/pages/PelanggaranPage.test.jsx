import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import PelanggaranPage from "./PelanggaranPage";

const mockAdd = vi.fn();
let addResult = true;
vi.mock("../states/action", () => ({
  asyncFetchPelanggaran: vi.fn(() => () => Promise.resolve()),
  asyncAddPelanggaran: (data) => {
    mockAdd(data);
    return () => Promise.resolve(addResult);
  },
}));
vi.mock("../../mahasiswa/states/action", () => ({
  asyncFetchMahasiswa: vi.fn(() => () => Promise.resolve()),
}));

const pembina = { id: 1, nama: "Bapak Asrama", role: "pembina" };
const mahasiswaUser = { id: 2, nama: "Budi", role: "mahasiswa" };
const riwayat = [
  { id: 1, nama: "Budi", jenis: "fatal", deskripsi: "Merokok", tanggal: "2026-10-01 10:00:00" },
  { id: 2, nama: "Budi", jenis: "peringatan", deskripsi: "Terlambat apel", tanggal: "2026-10-02 10:00:00" },
];

describe("PelanggaranPage", () => {
  afterEach(() => {
    mockAdd.mockClear();
    addResult = true;
  });

  it("mahasiswa hanya melihat riwayat, tanpa form catat", () => {
    renderWithProviders(<PelanggaranPage />, {
      preloadedState: {
        auth: { user: mahasiswaUser, isLogin: false },
        pelanggaran: { pelanggaran: riwayat, isPelanggaran: false, isPelanggaranAdd: false },
      },
    });
    expect(screen.getByRole("heading", { name: /riwayat pelanggaran/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Merokok")).toBeInTheDocument();
    expect(screen.getByText("Terlambat apel")).toBeInTheDocument();
    expect(screen.queryByTestId("pelanggaran-form")).not.toBeInTheDocument();
  });

  it("menampilkan status memuat dan pesan kosong", () => {
    const { unmount } = renderWithProviders(<PelanggaranPage />, {
      preloadedState: {
        auth: { user: mahasiswaUser, isLogin: false },
        pelanggaran: { pelanggaran: [], isPelanggaran: true, isPelanggaranAdd: false },
      },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/memuat riwayat/i);
    unmount();

    renderWithProviders(<PelanggaranPage />, {
      preloadedState: { auth: { user: mahasiswaUser, isLogin: false } },
    });
    expect(screen.getByText(/belum ada data/i)).toBeInTheDocument();
  });

  it("Bapak Asrama bisa mencatat pelanggaran dan form dikosongkan saat sukses", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PelanggaranPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        mahasiswa: {
          mahasiswa: [{ id: 2, nama: "Budi", nim: "1001" }],
          isMahasiswa: false,
          isMahasiswaAdd: false,
        },
      },
    });

    await user.selectOptions(screen.getByLabelText(/^mahasiswa$/i), "2");
    await user.selectOptions(screen.getByLabelText(/^jenis$/i), "fatal");
    await user.type(screen.getByLabelText(/deskripsi pelanggaran/i), "Merokok di kamar");
    await user.click(screen.getByRole("button", { name: /^catat$/i }));

    expect(mockAdd).toHaveBeenCalledWith({ user_id: "2", jenis: "fatal", deskripsi: "Merokok di kamar" });
    expect(screen.getByLabelText(/deskripsi pelanggaran/i)).toHaveValue("");
    expect(screen.getByLabelText(/^jenis$/i)).toHaveValue("peringatan");
  });

  it("isian tetap ada saat pencatatan gagal", async () => {
    addResult = false;
    const user = userEvent.setup();
    renderWithProviders(<PelanggaranPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        mahasiswa: {
          mahasiswa: [{ id: 2, nama: "Budi", nim: "1001" }],
          isMahasiswa: false,
          isMahasiswaAdd: false,
        },
      },
    });

    await user.selectOptions(screen.getByLabelText(/^mahasiswa$/i), "2");
    await user.type(screen.getByLabelText(/deskripsi pelanggaran/i), "Telat");
    await user.click(screen.getByRole("button", { name: /^catat$/i }));

    expect(screen.getByLabelText(/deskripsi pelanggaran/i)).toHaveValue("Telat");
  });

  it("tombol dinonaktifkan saat sedang mencatat", () => {
    renderWithProviders(<PelanggaranPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        pelanggaran: { pelanggaran: [], isPelanggaran: false, isPelanggaranAdd: true },
      },
    });
    expect(screen.getByRole("button", { name: /mencatat/i })).toBeDisabled();
  });
});
