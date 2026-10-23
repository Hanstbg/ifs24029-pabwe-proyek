const TEPI = {
  kuning: "tepi-kuning",
  merah: "tepi-merah",
  biru: "tepi-biru",
};

export default function StatCardComponent({ icon: Icon, label, value, color, tepi }) {
  return (
    <div className={`card p-4 flex items-center gap-3 ${TEPI[tepi] ?? "tepi-tinta"}`}>
      <span
        className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-gradient-to-br ${color}`}
      >
        <Icon size={21} />
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        <p className="angka text-2xl font-extrabold text-tinta leading-tight">{value}</p>
      </div>
    </div>
  );
}