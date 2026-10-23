import { describe, it, expect, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen } from "../../../test-utils";
import KarmaLayout from "./KarmaLayout";

const pembina = { id: 1, nama: "Bapak Asrama", nim: "pembina", role: "pembina" };

function renderLayout(preloadedState) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<KarmaLayout />}>
        <Route index element={<p>isi dashboard</p>} />
      </Route>
      <Route path="/auth/login" element={<p>halaman login</p>} />
    </Routes>,
    { preloadedState }
  );
}

describe("KarmaLayout", () => {
  beforeEach(() => localStorage.clear());

  it("mengalihkan ke login saat tidak ada token", () => {
    renderLayout();
    expect(screen.getByText("halaman login")).toBeInTheDocument();
  });

  it("menampilkan status memuat saat token ada tetapi user belum termuat", () => {
    localStorage.setItem("accessToken", "t");
    renderLayout();
    expect(screen.getByRole("status")).toHaveTextContent(/memuat data akun/i);
  });

  it("menampilkan sidebar, navbar, dan konten saat user tersedia", () => {
    localStorage.setItem("accessToken", "t");
    renderLayout({ auth: { user: pembina, isLogin: false } });
    expect(screen.getByText("isi dashboard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mahasiswa/i })).toBeInTheDocument();
  });

  it("tombol menu membuka sidebar dan backdrop menutupnya", async () => {
    localStorage.setItem("accessToken", "t");
    const user = userEvent.setup();
    renderLayout({ auth: { user: pembina, isLogin: false } });

    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /buka menu/i }));
    expect(screen.getByTestId("sidebar-backdrop")).toBeInTheDocument();
    await user.click(screen.getByTestId("sidebar-backdrop"));
    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
  });
});
