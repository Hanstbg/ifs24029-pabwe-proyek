import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import SanksosPage from "./SanksosPage";

const mockAksi = vi.fn();
vi.mock("../states/action", () => ({
  asyncFetchSanksos: vi.fn(() => () => Promise.resolve()),
  asyncAjukanSanksos: vi.fn(() => () => Promise.resolve(true)),
  asyncAksiSanksos: (...args) => {
    mockAksi(...args);
    return () => Promise.resolve(true);
  },
}));
vi.mock("../../demerit/states/action", () => ({
  asyncFetchDemerit: vi.fn(() => () => Promise.resolve()),
}));

const pembina = { id: 1, nama: "Bapak Asrama", role: "pembina" };
const mahasiswaUser = { id: 2, nama: "Budi", role: "mahasiswa" };

function stateWith(user, item) {
  return {
    auth: { user, isLogin: false },
    sanksos: { sanksos: [item], isSanksos: false, isSanksosSubmit: false },
  };
}

const base = { id: 5, nama: "Budi", jenis_demerit: "kuning", alasan: "Akumulasi 3 peringatan" };

describe("SanksosPage", () => {
  afterEach(() => mockAksi.mockClear());

  it("pembina: request diajukan bisa disetujui dengan tugas", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "diajukan", catatan: "Mohon dibantu" }),
    });
    expect(screen.getByText(/catatan mahasiswa: mohon dibantu/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tugas sanksos untuk budi/i), "bersihkan selasar");
    await user.click(screen.getByRole("button", { name: /setujui/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "setujui", "bersihkan selasar");
  });

  it("pembina: request diajukan bisa ditolak", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "diajukan" }),
    });
    await user.click(screen.getByRole("button", { name: /tolak/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "tolak", undefined);
  });

  it("pembina: request dikerjakan bisa diverifikasi selesai", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "dikerjakan", tugas: "Bersihkan selasar" }),
    });
    expect(screen.getByText("Bersihkan selasar")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /verifikasi selesai/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "selesai", undefined);
  });

  it("pembina: request selesai tidak punya tombol aksi", () => {
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "selesai" }),
    });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("mahasiswa: tugas disetujui bisa ditandai sudah dikerjakan", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(mahasiswaUser, { ...base, status: "disetujui", tugas: "Sapu halaman", catatan: "Siap" }),
    });
    expect(screen.getByRole("heading", { name: /sanksos saya/i })).toBeInTheDocument();
    expect(screen.getByText(/catatanmu: siap/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /tandai sudah dikerjakan/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "dikerjakan", undefined);
  });

  it("mahasiswa: status lain tidak punya tombol aksi", () => {
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(mahasiswaUser, { ...base, status: "diajukan" }),
    });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("menampilkan status memuat dan pesan kosong", () => {
    const { unmount } = renderWithProviders(<SanksosPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        sanksos: { sanksos: [], isSanksos: true, isSanksosSubmit: false },
      },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/memuat data sanksos/i);
    unmount();

    renderWithProviders(<SanksosPage />, { preloadedState: { auth: { user: pembina, isLogin: false } } });
    expect(screen.getByText(/belum ada request sanksos/i)).toBeInTheDocument();
  });
});
