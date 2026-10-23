// SweetAlert2 dimuat hanya saat dialog pertama kali dibutuhkan,
// sehingga tidak ikut membebani bundel awal halaman.
async function loadSwal() {
  const module = await import("sweetalert2");
  return module.default;
}

const CONFIRM_COLOR = "#1e293b";

export async function showSuccessDialog(message) {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: CONFIRM_COLOR,
  });
}

export async function showErrorDialog(message) {
  const Swal = await loadSwal();
  return Swal.fire({
    icon: "error",
    title: "Terjadi Kesalahan",
    text: message,
    confirmButtonColor: CONFIRM_COLOR,
  });
}

export async function showConfirmDialog(message) {
  const Swal = await loadSwal();
  const result = await Swal.fire({
    icon: "question",
    title: "Apakah kamu yakin?",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Ya, lanjutkan",
    cancelButtonText: "Batal",
    confirmButtonColor: CONFIRM_COLOR,
  });
  return result.isConfirmed;
}

/** Dialog isian teks. Mengembalikan teks (boleh kosong) atau null bila dibatalkan. */
export async function showPromptDialog(title, placeholder = "") {
  const Swal = await loadSwal();
  const result = await Swal.fire({
    title,
    input: "textarea",
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: "Kirim",
    cancelButtonText: "Batal",
    confirmButtonColor: CONFIRM_COLOR,
  });
  return result.isConfirmed ? (result.value ?? "") : null;
}

// SQLite menyimpan waktu UTC sebagai "YYYY-MM-DD HH:MM:SS" (tanpa zona waktu).
const SQLITE_DATETIME = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export function formatDate(value) {
  if (!value) return "-";
  const normalized = SQLITE_DATETIME.test(value) ? `${value.replace(" ", "T")}Z` : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
