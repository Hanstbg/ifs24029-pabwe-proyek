import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useInput from "./useInput";

describe("useInput", () => {
  it("mulai dari nilai default", () => {
    const { result } = renderHook(() => useInput("awal"));
    expect(result.current[0]).toBe("awal");
  });

  it("onChange memperbarui nilai teks", () => {
    const { result } = renderHook(() => useInput(""));
    act(() => result.current[1]({ target: { type: "text", value: "halo" } }));
    expect(result.current[0]).toBe("halo");
  });

  it("onChange memakai `checked` untuk checkbox", () => {
    const { result } = renderHook(() => useInput(false));
    act(() => result.current[1]({ target: { type: "checkbox", checked: true, value: "on" } }));
    expect(result.current[0]).toBe(true);
  });

  it("setValue dan reset bekerja", () => {
    const { result } = renderHook(() => useInput("a"));
    act(() => result.current[2]("b"));
    expect(result.current[0]).toBe("b");
    act(() => result.current[3]());
    expect(result.current[0]).toBe("a");
  });
});
