import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import * as authAction from "../states/action";
import RegisterPage from "./RegisterPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("RegisterPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("menampilkan form registrasi", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByLabelText(/nama lengkap/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nim$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kata sandi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nama asrama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/foto profil/i)).toBeInTheDocument();
  });

  it("submit memanggil asyncRegisterUser dan navigate ke '/' saat sukses", async () => {
    const spy = vi.spyOn(authAction, "asyncRegisterUser").mockReturnValue(async () => true);
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nama lengkap/i), "Budi Santoso");
    await user.type(screen.getByLabelText(/^nim$/i), "123456");
    await user.type(screen.getByLabelText(/kata sandi/i), "rahasia");
    await user.selectOptions(screen.getByLabelText(/nama asrama/i), "Asrama Simon Love Place");
    await user.click(screen.getByRole("button", { name: /daftar sekarang/i }));

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        nama: "Budi Santoso",
        nim: "123456",
        password: "rahasia",
        asrama: "Asrama Simon Love Place",
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("tidak navigate saat registrasi gagal", async () => {
    vi.spyOn(authAction, "asyncRegisterUser").mockReturnValue(async () => false);
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/nama lengkap/i), "Budi");
    await user.type(screen.getByLabelText(/^nim$/i), "123456");
    await user.type(screen.getByLabelText(/kata sandi/i), "rahasia");
    await user.click(screen.getByRole("button", { name: /daftar sekarang/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
