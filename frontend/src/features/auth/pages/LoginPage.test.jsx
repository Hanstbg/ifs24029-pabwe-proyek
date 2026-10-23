import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import * as authAction from "../states/action";
import LoginPage from "./LoginPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("LoginPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockClear();
  });

  it("menampilkan form login", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/nim \/ username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kata sandi/i)).toBeInTheDocument();
  });

  it("submit memanggil asyncLoginUser dan navigate ke '/' saat sukses", async () => {
    const spy = vi.spyOn(authAction, "asyncLoginUser").mockReturnValue(async () => true);
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/nim \/ username/i), "pembina");
    await user.type(screen.getByLabelText(/kata sandi/i), "pembina123");
    await user.click(screen.getByRole("button", { name: /masuk sekarang/i }));

    expect(spy).toHaveBeenCalledWith({ nim: "pembina", password: "pembina123" });
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("tidak navigate saat login gagal", async () => {
    vi.spyOn(authAction, "asyncLoginUser").mockReturnValue(async () => false);
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/nim \/ username/i), "x");
    await user.type(screen.getByLabelText(/kata sandi/i), "y");
    await user.click(screen.getByRole("button", { name: /masuk sekarang/i }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("menampilkan 'Memproses...' dan menonaktifkan tombol saat isLogin true", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: { auth: { user: null, isLogin: true } },
    });
    expect(screen.getByRole("button", { name: /memproses/i })).toBeDisabled();
  });
});
