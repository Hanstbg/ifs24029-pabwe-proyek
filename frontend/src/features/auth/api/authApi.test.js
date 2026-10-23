import { describe, it, expect, vi, afterEach } from "vitest";
import apiHelper from "../../../helpers/apiHelper";
import authApi from "./authApi";

vi.mock("../../../helpers/apiHelper", () => ({ default: vi.fn().mockResolvedValue({}) }));

describe("authApi", () => {
  afterEach(() => vi.clearAllMocks());

  it("login memanggil POST /auth/login", async () => {
    await authApi.login({ nim: "1001", password: "x" });
    expect(apiHelper).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { nim: "1001", password: "x" } });
  });

  it("register memanggil POST /auth/register", async () => {
    await authApi.register({ nama: "A", nim: "1001", password: "x", asrama: "Asrama Simon Love Place" });
    expect(apiHelper).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { nama: "A", nim: "1001", password: "x", asrama: "Asrama Simon Love Place" },
    });
  });

  it("getMe memanggil GET /auth/me", async () => {
    await authApi.getMe();
    expect(apiHelper).toHaveBeenCalledWith("/auth/me", { method: "GET" });
  });
});
