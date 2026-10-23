import { describe, it, expect, vi, afterEach } from "vitest";
import authApi from "../api/authApi";
import { putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncFetchMe, asyncLoginUser, asyncLogoutUser } from "./action";
import { loginStart, loginSuccess, loginFailure, setUser, clearUser } from "./reducer";

vi.mock("../api/authApi", () => ({
  default: { login: vi.fn(), getMe: vi.fn() },
}));
vi.mock("../../../helpers/apiHelper", () => ({
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn().mockResolvedValue(true),
}));

describe("auth async actions", () => {
  afterEach(() => vi.clearAllMocks());

  it("asyncFetchMe sukses: dispatch setUser", async () => {
    authApi.getMe.mockResolvedValue({ user: { id: 1 } });
    const dispatch = vi.fn();
    await asyncFetchMe()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setUser({ id: 1 }));
  });

  it("asyncFetchMe tanpa data: dispatch setUser(null)", async () => {
    authApi.getMe.mockResolvedValue(undefined);
    const dispatch = vi.fn();
    await asyncFetchMe()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(setUser(null));
  });

  it("asyncFetchMe gagal: hapus token dan dispatch clearUser", async () => {
    authApi.getMe.mockRejectedValue(new Error("x"));
    const dispatch = vi.fn();
    await asyncFetchMe()(dispatch);
    expect(removeAccessToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
  });

  it("asyncLoginUser sukses: simpan token, set user, return true", async () => {
    authApi.login.mockResolvedValue({ token: "tkn", user: { id: 2, role: "pembina" } });
    const dispatch = vi.fn();
    const result = await asyncLoginUser({ nim: "pembina", password: "pembina123" })(dispatch);
    expect(authApi.login).toHaveBeenCalledWith({ nim: "pembina", password: "pembina123" });
    expect(dispatch).toHaveBeenCalledWith(loginStart());
    expect(putAccessToken).toHaveBeenCalledWith("tkn");
    expect(dispatch).toHaveBeenCalledWith(setUser({ id: 2, role: "pembina" }));
    expect(dispatch).toHaveBeenCalledWith(loginSuccess());
    expect(result).toBe(true);
  });

  it("asyncLoginUser gagal: dispatch failure, tampilkan error, return false", async () => {
    authApi.login.mockRejectedValue(new Error("NIM atau password salah"));
    const dispatch = vi.fn();
    const result = await asyncLoginUser({ nim: "a", password: "b" })(dispatch);
    expect(dispatch).toHaveBeenCalledWith(loginFailure());
    expect(showErrorDialog).toHaveBeenCalledWith("NIM atau password salah");
    expect(result).toBe(false);
  });

  it("asyncLogoutUser menghapus token dan user", () => {
    const dispatch = vi.fn();
    asyncLogoutUser()(dispatch);
    expect(removeAccessToken).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
  });
});
