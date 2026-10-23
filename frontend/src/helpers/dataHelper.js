/** Memastikan nilai yang dirender sebagai daftar selalu berupa array. */
export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getInitial(name) {
  return name ? String(name).trim().charAt(0).toUpperCase() || "?" : "?";
}

export const ROLE_LABEL = {
  pembina: "Bapak Asrama",
  mahasiswa: "Mahasiswa",
};

export function getRoleLabel(role) {
  return ROLE_LABEL[role] ?? "Pengguna";
}

// Request Sanksos yang masih berjalan (belum selesai / ditolak).
export const SANKSOS_BERJALAN = ["diajukan", "disetujui", "dikerjakan"];

export const DAFTAR_ASRAMA = [
  "Asrama Simon Love Place",
  "Asrama Ada Love Place",
  "Asrama Louis Pasteur",
  "Asrama Marie Currie",
  "Asrama Max Planck",
  "Asrama Archimedes",
  "Asrama Nichola Tesla",
];

export function hasOpenSanksos(sanksosList, demeritId) {
  return toArray(sanksosList).some(
    (item) => item.demerit_id === demeritId && SANKSOS_BERJALAN.includes(item.status)
  );
}
