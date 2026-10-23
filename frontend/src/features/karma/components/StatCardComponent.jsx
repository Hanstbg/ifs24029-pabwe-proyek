export default function StatCardComponent({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <span
        className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md ${color}`}
      >
        <Icon size={22} />
      </span>
      <div>
        <p className="text-xs font-medium text-slate-600">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}
