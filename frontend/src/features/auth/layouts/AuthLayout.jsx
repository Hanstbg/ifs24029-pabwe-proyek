import { Navigate, Outlet } from "react-router-dom";
import { IconShieldCheck, IconChecklist, IconAlertTriangle } from "@tabler/icons-react";
import { getAccessToken } from "../../../helpers/apiHelper";

export default function AuthLayout() {
  if (getAccessToken()) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between bg-tinta p-12 text-white">
        <div className="absolute right-12 bottom-24 hidden xl:block" aria-hidden="true">
          <div className="relative w-56 h-64">
            <div className="kartu-kiri absolute left-0 top-6 w-36 h-52 rounded-xl bg-kuning shadow-2xl" />
            <div className="kartu-kanan absolute left-20 top-0 w-36 h-52 rounded-xl bg-merah shadow-2xl" />
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <img src="/logo.svg" alt="" className="w-10 h-10" />
          <span className="font-extrabold text-xl tracking-[0.2em]">KARMA</span>
        </div>
        <div className="relative space-y-6 max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">Disiplin asrama, tercatat dan transparan.</h2>
          <p className="text-slate-300">
            Pantau peringatan, kartu kuning, dan kartu merah, lalu bersihkan lewat Sanksos.
          </p>
          <ul className="space-y-3 text-sm text-slate-200">
            <li className="flex items-center gap-3"><IconAlertTriangle size={20} /> Demerit terbit otomatis sesuai aturan</li>
            <li className="flex items-center gap-3"><IconChecklist size={20} /> Pembersihan lewat Sanksos</li>
            <li className="flex items-center gap-3"><IconShieldCheck size={20} /> Akses sesuai peran</li>
          </ul>
        </div>
        <p className="relative text-xs text-slate-300">&copy; {new Date().getFullYear()} KARMA</p>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md card p-6 sm:p-8 shadow-lg">
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <img src="/logo.svg" alt="Logo" className="w-9 h-9" />
            <span className="font-extrabold text-tinta text-lg tracking-[0.18em]">KARMA</span>
          </div>
          <Outlet />
        </div>
      </div>
    </main>
  );
}