import { describe, it, expect } from "vitest";
import reducer, { loginStart, loginSuccess, loginFailure, setUser, clearUser } from "./reducer";

const initial = { user: null, isLogin: false };

describe("auth reducer", () => {
  it("loginStart menyalakan isLogin; success dan failure mematikannya", () => {
    const started = reducer(initial, loginStart());
    expect(started.isLogin).toBe(true);
    expect(reducer(started, loginSuccess()).isLogin).toBe(false);
    expect(reducer(started, loginFailure()).isLogin).toBe(false);
  });

  it("setUser dan clearUser mengatur user", () => {
    const withUser = reducer(initial, setUser({ id: 1, nama: "A" }));
    expect(withUser.user).toEqual({ id: 1, nama: "A" });
    expect(reducer(withUser, clearUser()).user).toBeNull();
  });
});
