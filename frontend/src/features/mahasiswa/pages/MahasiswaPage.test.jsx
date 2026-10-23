import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../../../test-utils";
import MahasiswaPage from "./MahasiswaPage";

const mockAdd = vi.fn();
let addResult = true;
vi.mock("../states/action", () => ({
  asyncFetchMahasiswa: vi.fn(() => () => Promise.resolve()),
  asyncAddMahasiswa: (data) => {
    mockAdd(data);
    return () => Promise.resolve(addResult);
  },
}));

describe("MahasiswaPage", () => {
  afterEach(() => {
    mockAdd.mockClear();
    addResult = true;
  });

  it("menampilkan rekap mahasiswa", () => {
    renderWithProviders(<MahasiswaPage />, {
      preloadedState: {
        mahasiswa: {
          mahasiswa: [{ id: 1, nama: "Budi", nim: "1001", peringatan_berjalan: 2, kuning_aktif: 1, merah_aktif: 0 }],
          isMahasiswa: false,
          isMahasiswaAdd: false,
        },
      },
    });
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("menampilkan pesan kosong dan status memuat", () => {
    const { unmount } = renderWithProviders(<MahasiswaPage />);
    expect(screen.getByText(/belum ada mahasiswa/i)).toBeInTheDocument();
    unmount();

    renderWithProviders(<MahasiswaPage />, {
      preloadedState: { mahasiswa: { mahasiswa: [], isMahasiswa: true, isMahasiswaAdd: false } },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/memuat data mahasiswa/i);
    expect(screen.queryByText(/belum ada mahasiswa/i)).not.toBeInTheDocument();
  });

  it("submit form mengirim data dan mengosongkan isian saat sukses", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MahasiswaPage />);

    await user.type(screen.getByLabelText(/^nama$/i), "Ani");
    await user.type(screen.getByLabelText(/^nim$/i), "1003");
    await user.type(screen.getByLabelText(/password awal/i), "rahasia");
    await user.click(screen.getByRole("button", { name: /simpan/i }));

    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ nama: "Ani", nim: "1003", password: "rahasia" })
    );
    expect(screen.getByLabelText(/^nama$/i)).toHaveValue("");
    expect(screen.getByLabelText(/^nim$/i)).toHaveValue("");
    expect(screen.getByLabelText(/password awal/i)).toHaveValue("");
  });

  it("isian tetap ada saat penyimpanan gagal", async () => {
    addResult = false;
    const user = userEvent.setup();
    renderWithProviders(<MahasiswaPage />);

    await user.type(screen.getByLabelText(/^nama$/i), "Ani");
    await user.type(screen.getByLabelText(/^nim$/i), "1003");
    await user.type(screen.getByLabelText(/password awal/i), "rahasia");
    await user.click(screen.getByRole("button", { name: /simpan/i }));

    expect(screen.getByLabelText(/^nama$/i)).toHaveValue("Ani");
  });

  it("tombol dinonaktifkan saat sedang menyimpan", () => {
    renderWithProviders(<MahasiswaPage />, {
      preloadedState: { mahasiswa: { mahasiswa: [], isMahasiswa: false, isMahasiswaAdd: true } },
    });
    expect(screen.getByRole("button", { name: /menyimpan/i })).toBeDisabled();
  });
});
