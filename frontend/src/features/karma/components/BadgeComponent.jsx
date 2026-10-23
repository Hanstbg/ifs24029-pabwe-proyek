const STYLES = {
  kuning: "bg-kuning text-slate-900",
  merah: "bg-merah text-white",
  aktif: "bg-amber-100 text-amber-800",
  diajukan: "bg-amber-100 text-amber-800",
  peringatan: "bg-amber-100 text-amber-800",
  bersih: "bg-emerald-100 text-emerald-800",
  selesai: "bg-emerald-100 text-emerald-800",
  disetujui: "bg-sky-100 text-sky-800",
  dikerjakan: "bg-sky-100 text-sky-800",
  ditolak: "bg-slate-200 text-slate-700",
  dikonversi: "bg-slate-200 text-slate-700",
};

export default function BadgeComponent({ value }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
        STYLES[value] ?? "bg-slate-200 text-slate-700"
      }`}
    >
      {value}
    </span>
  );
}
