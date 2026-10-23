import { Navigate, Outlet } from "react-router-dom";
import { IconShieldCheck, IconChecklist, IconAlertTriangle } from "@tabler/icons-react";
import { getAccessToken } from "../../../helpers/apiHelper";

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-12 text-white">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-kuning/20" />
        <div className="absolute -left-16 bottom-10 w-64 h-64 rounded-full bg-merah/20" />
        <div className="relative flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-10 h-10" />
          <span className="font-extrabold text-xl tracking-[0.2em]">KARMA</span>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight">Disiplin asrama, tercatat dan transparan.</h2>
          <p className="text-white">
            Pantau peringatan, kartu kuning, dan kartu merah, lalu bersihkan lewat Sanksos.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3"><IconAlertTriangle size={20} /> Demerit terbit otomatis sesuai aturan</li>
            <li className="flex items-center gap-3"><IconChecklist size={20} /> Pembersihan lewat Sanksos</li>
            <li className="flex items-center gap-3"><IconShieldCheck size={20} /> Akses sesuai peran</li>
          </ul>
        </div>
        <p className="relative text-xs text-white">&copy; {new Date().getFullYear()} KARMA</p>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md card p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
            <span className="font-extrabold text-slate-900 text-lg tracking-[0.18em]">KARMA</span>
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}
