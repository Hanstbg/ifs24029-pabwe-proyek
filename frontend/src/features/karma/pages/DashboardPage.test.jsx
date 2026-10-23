import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import DashboardPage from "./DashboardPage";

const mockAjukan = vi.fn();
vi.mock("../../mahasiswa/states/action", () => ({
  asyncFetchMahasiswa: vi.fn(() => () => Promise.resolve()),
}));
vi.mock("../../demerit/states/action", () => ({
  asyncFetchDemerit: vi.fn(() => () => Promise.resolve()),
}));
vi.mock("../../sanksos/states/action", () => ({
  asyncFetchSanksos: vi.fn(() => () => Promise.resolve()),
  asyncAjukanSanksos: (id) => {
    mockAjukan(id);
    return () => Promise.resolve(true);
  },
}));

const pembina = { id: 1, nama: "Bapak Asrama", role: "pembina" };
const mahasiswa = { id: 2, nama: "Budi", role: "mahasiswa" };

describe("DashboardPage - Bapak Asrama", () => {
  afterEach(() => mockAjukan.mockClear());

  it("menghitung statistik dari data mahasiswa dan Sanksos", () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        mahasiswa: {
          mahasiswa: [
            { id: 1, kuning_aktif: 1, merah_aktif: 0 },
            { id: 2, kuning_aktif: 1, merah_aktif: 2 },
            { id: 3 },
          ],
          isMahasiswa: false,
          isMahasiswaAdd: false,
        },
        sanksos: {
          sanksos: [{ status: "diajukan" }, { status: "dikerjakan" }, { status: "selesai" }],
          isSanksos: false,
          isSanksosSubmit: false,
        },
      },
    });
    expect(screen.getByRole("heading", { name: /dashboard bapak asrama/i })).toBeInTheDocument();
    expect(screen.getByText("Mahasiswa").nextSibling).toHaveTextContent("3");
    expect(screen.getByText("Kuning aktif").nextSibling).toHaveTextContent("2");
    expect(screen.getByText("Merah aktif").nextSibling).toHaveTextContent("2");
    expect(screen.getByText(/2 request sanksos menunggu/i)).toBeInTheDocument();
  });

  it("menampilkan pesan kosong saat tidak ada request menunggu", () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: { auth: { user: pembina, isLogin: false } },
    });
    expect(screen.getByText(/tidak ada request sanksos yang menunggu/i)).toBeInTheDocument();
  });
});

describe("DashboardPage - Mahasiswa", () => {
  const ringkasan = { peringatan_berjalan: 2, kuning_aktif: 1, merah_aktif: 0 };

  it("menampilkan ringkasan kartu dan daftar demerit", () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        auth: { user: mahasiswa, isLogin: false },
        demerit: {
          ringkasan,
          isDemerit: false,
          demerit: [{ id: 1, jenis: "kuning", status: "bersih", alasan: "Akumulasi 3 peringatan", tanggal: "2026-10-01 10:00:00" }],
        },
      },
    });
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByText("Akumulasi 3 peringatan")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /ajukan sanksos/i })).not.toBeInTheDocument();
  });

  it("demerit aktif tanpa request menampilkan tombol Ajukan Sanksos", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        auth: { user: mahasiswa, isLogin: false },
        demerit: {
          ringkasan,
          isDemerit: false,
          demerit: [{ id: 7, jenis: "merah", status: "aktif", alasan: "Fatal", tanggal: "2026-10-01 10:00:00" }],
        },
      },
    });
    await user.click(screen.getByRole("button", { name: /ajukan sanksos/i }));
    expect(mockAjukan).toHaveBeenCalledWith(7);
  });

  it("demerit aktif dengan request berjalan menampilkan keterangan", () => {
    renderWithProviders(<DashboardPage />, {
      preloadedState: {
        auth: { user: mahasiswa, isLogin: false },
        demerit: {
          ringkasan,
          isDemerit: false,
          demerit: [{ id: 7, jenis: "merah", status: "aktif", alasan: "Fatal", tanggal: "2026-10-01 10:00:00" }],
        },
        sanksos: {
          sanksos: [{ id: 1, demerit_id: 7, status: "diajukan" }],
          isSanksos: false,
          isSanksosSubmit: false,
        },
      },
    });
    expect(screen.getByText(/request berjalan/i)).toBeInTheDocument();
  });

  it("menampilkan status memuat dan pesan kosong", () => {
    const { unmount } = renderWithProviders(<DashboardPage />, {
      preloadedState: {
        auth: { user: mahasiswa, isLogin: false },
        demerit: { ringkasan: null, isDemerit: true, demerit: [] },
      },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/memuat data demerit/i);
    unmount();

    renderWithProviders(<DashboardPage />, {
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(screen.getByText(/belum ada demerit/i)).toBeInTheDocument();
  });
});
