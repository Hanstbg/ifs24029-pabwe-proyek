import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../../helpers/apiHelper";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function KarmaLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // Ada token tetapi data pengguna belum selesai dimuat (asyncFetchMe di main.jsx).
  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="sr-only">KARMA</h1>
        <p role="status" className="text-sm text-slate-600">
          Memuat data akun...
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex">
      <SidebarComponent isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <NavbarComponent onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
