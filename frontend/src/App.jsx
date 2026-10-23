import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./features/auth/layouts/AuthLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import KarmaLayout from "./features/karma/layouts/KarmaLayout";
import RequireRole from "./features/karma/components/RequireRole";
import DashboardPage from "./features/karma/pages/DashboardPage";

const MahasiswaPage = lazy(() => import("./features/mahasiswa/pages/MahasiswaPage"));
const AsramaPage = lazy(() => import("./features/asrama/pages/AsramaPage"));
const PelanggaranPage = lazy(() => import("./features/pelanggaran/pages/PelanggaranPage"));
const SanksosPage = lazy(() => import("./features/sanksos/pages/SanksosPage"));

function PageFallback() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="sr-only">KARMA</h1>
      <p role="status" className="text-sm text-slate-600">
        Memuat halaman...
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<KarmaLayout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="mahasiswa"
            element={
              <RequireRole role="pembina">
                <MahasiswaPage />
              </RequireRole>
            }
          />
          <Route
            path="asrama"
            element={
              <RequireRole role="pembina">
                <AsramaPage />
              </RequireRole>
            }
          />
          <Route path="pelanggaran" element={<PelanggaranPage />} />
          <Route path="sanksos" element={<SanksosPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}