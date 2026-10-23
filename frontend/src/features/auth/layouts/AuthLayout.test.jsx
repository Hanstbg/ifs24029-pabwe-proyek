import { describe, it, expect, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen } from "../../../test-utils";
import AuthLayout from "./AuthLayout";

function renderLayout() {
  return renderWithProviders(
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<p>isi login</p>} />
      </Route>
      <Route path="/" element={<p>halaman utama</p>} />
    </Routes>,
    { route: "/auth/login" }
  );
}

describe("AuthLayout", () => {
  beforeEach(() => localStorage.clear());

  it("menampilkan konten anak saat belum login", () => {
    renderLayout();
    expect(screen.getByText("isi login")).toBeInTheDocument();
  });

  it("mengalihkan ke '/' saat sudah ada token", () => {
    localStorage.setItem("accessToken", "t");
    renderLayout();
    expect(screen.getByText("halaman utama")).toBeInTheDocument();
  });
});
