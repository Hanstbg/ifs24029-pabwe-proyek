import { describe, it, expect, beforeEach } from "vitest";
import { renderWithProviders, screen } from "./test-utils";
import App from "./App";

const pembina = { id: 1, nama: "Bapak Asrama", nim: "pembina", role: "pembina" };
const mahasiswa = { id: 2, nama: "Budi", nim: "1001", role: "mahasiswa" };

describe("App routing", () => {
  beforeEach(() => localStorage.clear());

  it("tanpa token, '/' dialihkan ke halaman login", async () => {
    renderWithProviders(<App />, { route: "/" });
    expect(await screen.findByRole("heading", { name: /selamat datang/i })).toBeInTheDocument();
  });

  it("rute tak dikenal dialihkan ke '/' lalu ke login", async () => {
    renderWithProviders(<App />, { route: "/tidak-ada" });
    expect(await screen.findByRole("heading", { name: /selamat datang/i })).toBeInTheDocument();
  });

  it("pembina dengan token membuka halaman Mahasiswa", async () => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(<App />, {
      route: "/mahasiswa",
      preloadedState: { auth: { user: pembina, isLogin: false } },
    });
    expect(await screen.findByRole("heading", { name: /rekap mahasiswa/i })).toBeInTheDocument();
  });

  it("mahasiswa tidak bisa membuka halaman Mahasiswa dan kembali ke dashboard", async () => {
    localStorage.setItem("accessToken", "t");
    renderWithProviders(<App />, {
      route: "/mahasiswa",
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(await screen.findByRole("heading", { name: /dashboard mahasiswa/i })).toBeInTheDocument();
  });

  it("membuka halaman Pelanggaran dan Sanksos", async () => {
    localStorage.setItem("accessToken", "t");
    const { unmount } = renderWithProviders(<App />, {
      route: "/pelanggaran",
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(await screen.findByRole("heading", { name: /riwayat pelanggaran/i, level: 1 })).toBeInTheDocument();
    unmount();

    renderWithProviders(<App />, {
      route: "/sanksos",
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(await screen.findByRole("heading", { name: /sanksos saya/i })).toBeInTheDocument();
  });
});
