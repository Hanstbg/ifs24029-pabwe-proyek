import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IconLayoutDashboard,
  IconUsers,
  IconAlertTriangle,
  IconChecklist,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";

const MENU = {
  pembina: [
    { to: "/", label: "Dashboard", icon: IconLayoutDashboard, end: true },
    { to: "/mahasiswa", label: "Mahasiswa", icon: IconUsers },
    { to: "/pelanggaran", label: "Pelanggaran", icon: IconAlertTriangle },
    { to: "/sanksos", label: "Sanksos", icon: IconChecklist },
    { to: "/profil", label: "Profil", icon: IconUserCircle },
  ],
  mahasiswa: [
    { to: "/", label: "Dashboard", icon: IconLayoutDashboard, end: true },
    { to: "/pelanggaran", label: "Riwayat Pelanggaran", icon: IconAlertTriangle },
    { to: "/sanksos", label: "Sanksos Saya", icon: IconChecklist },
    { to: "/profil", label: "Profil", icon: IconUserCircle },
  ],
};

export default function SidebarComponent({ isOpen, onClose }) {
  const user = useSelector((state) => state.auth.user);
  const links = MENU[user?.role] ?? MENU.mahasiswa;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-backdrop"
        />
      )}

      <aside
        className={`fixed lg:sticky z-30 top-0 left-0 h-screen w-64 shrink-0 bg-tinta text-white transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="w-8 h-8" />
            <span className="font-extrabold text-white tracking-[0.18em]">KARMA</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="lg:hidden p-1.5 rounded-lg text-white hover:bg-white/10"
          >
            <IconX size={20} />
          </button>
        </div>

        <nav className="px-3 pt-5 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition border-l-4 ${
                  isActive
                    ? "bg-white/10 text-white border-kuning"
                    : "text-slate-300 border-transparent hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 rounded-xl bg-white/5 border border-white/10 p-4 text-white">
          <div className="flex items-center gap-1.5 mb-2" aria-hidden="true">
            <span className="w-3 h-4 rounded-sm bg-kuning -rotate-6" />
            <span className="w-3 h-4 rounded-sm bg-merah rotate-6" />
          </div>
          <p className="text-sm font-bold">Aturan demerit</p>
          <p className="text-xs text-slate-300 mt-1">
            3 peringatan = 1 kuning. 2 kuning = 1 merah. Pelanggaran fatal langsung merah.
          </p>
        </div>
      </aside>
    </>
  );
}