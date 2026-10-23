import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen } from "../../../test-utils";
import BadgeComponent from "./BadgeComponent";
import StatCardComponent from "./StatCardComponent";
import RequireRole from "./RequireRole";
import SidebarComponent from "./SidebarComponent";
import NavbarComponent from "./NavbarComponent";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const pembina = { id: 1, nama: "Bapak Asrama", nim: "pembina", role: "pembina" };
const mahasiswa = { id: 2, nama: "Budi", nim: "1001", role: "mahasiswa" };

describe("BadgeComponent", () => {
  it("menampilkan nilai dan memakai warna khusus untuk merah", () => {
    renderWithProviders(<BadgeComponent value="merah" />);
    expect(screen.getByText("merah")).toHaveClass("bg-merah");
  });

  it("memakai warna default untuk nilai tak dikenal", () => {
    renderWithProviders(<BadgeComponent value="entah" />);
    expect(screen.getByText("entah")).toHaveClass("bg-slate-200");
  });
});

describe("StatCardComponent", () => {
  it("menampilkan label dan nilai", () => {
    renderWithProviders(<StatCardComponent icon={() => <svg />} label="Total" value={7} color="x" />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});

describe("RequireRole", () => {
  function renderGuard(user) {
    return renderWithProviders(
      <Routes>
        <Route path="/" element={<p>beranda</p>} />
        <Route
          path="/rahasia"
          element={
            <RequireRole role="pembina">
              <p>area pembina</p>
            </RequireRole>
          }
        />
      </Routes>,
      { route: "/rahasia", preloadedState: { auth: { user, isLogin: false } } }
    );
  }

  it("menampilkan anak untuk peran yang sesuai", () => {
    renderGuard(pembina);
    expect(screen.getByText("area pembina")).toBeInTheDocument();
  });

  it("mengalihkan ke '/' untuk peran lain", () => {
    renderGuard(mahasiswa);
    expect(screen.getByText("beranda")).toBeInTheDocument();
  });
});

describe("SidebarComponent", () => {
  it("menu pembina memuat Mahasiswa; menu mahasiswa tidak", () => {
    const { unmount } = renderWithProviders(<SidebarComponent isOpen onClose={() => {}} />, {
      preloadedState: { auth: { user: pembina, isLogin: false } },
    });
    expect(screen.getByRole("link", { name: /^mahasiswa$/i })).toHaveAttribute("href", "/mahasiswa");
    unmount();

    renderWithProviders(<SidebarComponent isOpen onClose={() => {}} />, {
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(screen.queryByRole("link", { name: /^mahasiswa$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sanksos saya/i })).toBeInTheDocument();
  });

  it("memakai menu mahasiswa saat user belum ada, dan tombol tutup memanggil onClose", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SidebarComponent isOpen={false} onClose={onClose} />);
    expect(screen.getByRole("link", { name: /sanksos saya/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /tutup menu/i }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("NavbarComponent", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.setItem("accessToken", "t");
  });

  it("menampilkan nama, peran, dan memanggil onMenuClick", async () => {
    const onMenuClick = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<NavbarComponent onMenuClick={onMenuClick} />, {
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });
    expect(screen.getByText("Budi")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /buka menu/i }));
    expect(onMenuClick).toHaveBeenCalled();
  });

  it("memakai nama default saat user belum ada", () => {
    renderWithProviders(<NavbarComponent onMenuClick={() => {}} />);
    expect(screen.getByRole("button", { name: /menu akun pengguna/i })).toBeInTheDocument();
  });

  it("dropdown menampilkan NIM, dan Keluar menghapus token lalu ke halaman login", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<NavbarComponent onMenuClick={() => {}} />, {
      preloadedState: { auth: { user: mahasiswa, isLogin: false } },
    });

    await user.click(screen.getByRole("button", { name: /menu akun budi/i }));
    expect(screen.getByTestId("navbar-dropdown")).toHaveTextContent("1001");

    await user.click(screen.getByRole("button", { name: /keluar/i }));
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(store.getState().auth.user).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith("/auth/login", { replace: true });
  });

  it("dropdown tanpa NIM tidak menampilkan pemisah", async () => {
    const user = userEvent.setup();
    renderWithProviders(<NavbarComponent onMenuClick={() => {}} />, {
      preloadedState: { auth: { user: { id: 9, nama: "X", role: "pembina" }, isLogin: false } },
    });
    await user.click(screen.getByRole("button", { name: /menu akun x/i }));
    expect(screen.getByTestId("navbar-dropdown")).not.toHaveTextContent("·");
  });
});
