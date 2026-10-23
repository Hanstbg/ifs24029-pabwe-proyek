import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  IconUsers,
  IconAlertTriangle,
  IconChecklist,
  IconCards,
  IconInbox,
} from "@tabler/icons-react";
import { asyncFetchMahasiswa } from "../../mahasiswa/states/action";
import { asyncFetchSanksos, asyncAjukanSanksos } from "../../sanksos/states/action";
import { asyncFetchDemerit } from "../../demerit/states/action";
import { toArray, hasOpenSanksos } from "../../../helpers/dataHelper";
import { formatDate } from "../../../helpers/toolsHelper";
import StatCardComponent from "../components/StatCardComponent";
import BadgeComponent from "../components/BadgeComponent";

function Hero({ title, subtitle }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 sm:p-8 text-white shadow-xl">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-kuning/25" />
      <div className="absolute right-24 -bottom-16 w-40 h-40 rounded-full bg-merah/25" />
      <div className="relative">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-sm text-white mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function PembinaDashboard() {
  const dispatch = useDispatch();
  const mahasiswa = toArray(useSelector((state) => state.mahasiswa.mahasiswa));
  const sanksos = toArray(useSelector((state) => state.sanksos.sanksos));

  useEffect(() => {
    dispatch(asyncFetchMahasiswa());
    dispatch(asyncFetchSanksos());
  }, [dispatch]);

  const stats = useMemo(
    () => ({
      total: mahasiswa.length,
      kuning: mahasiswa.reduce((sum, item) => sum + (item.kuning_aktif ?? 0), 0),
      merah: mahasiswa.reduce((sum, item) => sum + (item.merah_aktif ?? 0), 0),
      perluTindakan: sanksos.filter((item) => item.status === "diajukan" || item.status === "dikerjakan")
        .length,
    }),
    [mahasiswa, sanksos]
  );

  return (
    <div className="space-y-6">
      <Hero title="Dashboard Bapak Asrama" subtitle="Ringkasan kondisi demerit seluruh mahasiswa." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCardComponent icon={IconUsers} label="Mahasiswa" value={stats.total} color="from-slate-500 to-slate-700 text-white" />
        <StatCardComponent icon={IconCards} label="Kuning aktif" value={stats.kuning} color="from-amber-300 to-kuning text-slate-900" />
        <StatCardComponent icon={IconCards} label="Merah aktif" value={stats.merah} color="from-red-500 to-merah text-white" />
        <StatCardComponent icon={IconChecklist} label="Sanksos perlu tindakan" value={stats.perluTindakan} color="from-sky-500 to-cyan-600 text-white" />
      </div>

      <div className="card p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {stats.perluTindakan > 0
            ? `${stats.perluTindakan} request Sanksos menunggu persetujuan atau verifikasi.`
            : "Tidak ada request Sanksos yang menunggu."}
        </p>
        <div className="flex gap-2">
          <Link to="/pelanggaran" className="btn-ghost">Catat Pelanggaran</Link>
          <Link to="/sanksos" className="btn-primary">Lihat Sanksos</Link>
        </div>
      </div>
    </div>
  );
}

function MahasiswaDashboard() {
  const dispatch = useDispatch();
  const ringkasan = useSelector((state) => state.demerit.ringkasan);
  const demerit = toArray(useSelector((state) => state.demerit.demerit));
  const sanksos = toArray(useSelector((state) => state.sanksos.sanksos));
  const isLoading = useSelector((state) => state.demerit.isDemerit);
  const isSubmitting = useSelector((state) => state.sanksos.isSanksosSubmit);

  useEffect(() => {
    dispatch(asyncFetchDemerit());
    dispatch(asyncFetchSanksos());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <Hero title="Dashboard Mahasiswa" subtitle="Pantau peringatan dan demerit milikmu." />

      {ringkasan && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCardComponent icon={IconAlertTriangle} label="Peringatan berjalan" value={`${ringkasan.peringatan_berjalan} / 3`} color="from-amber-500 to-orange-500 text-white" />
          <StatCardComponent icon={IconCards} label="Demerit kuning" value={`${ringkasan.kuning_aktif} / 2`} color="from-amber-300 to-kuning text-slate-900" />
          <StatCardComponent icon={IconCards} label="Demerit merah" value={ringkasan.merah_aktif} color="from-red-500 to-merah text-white" />
        </div>
      )}

      <div className="card p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">Demerit Saya</h2>

        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat data demerit...
          </p>
        )}

        {!isLoading && demerit.length === 0 && (
          <div className="flex flex-col items-center text-center py-10 text-slate-600">
            <IconInbox size={40} stroke={1.3} />
            <p className="text-sm mt-2">Belum ada demerit. Pertahankan!</p>
          </div>
        )}

        <ul className="divide-y divide-slate-100">
          {demerit.map((item) => (
            <li key={item.id} className="py-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BadgeComponent value={item.jenis} />
                  <BadgeComponent value={item.status} />
                  {item.poin_sekarang !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Sisa: {item.poin_sekarang} poin
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mt-1.5">{item.alasan}</p>
                <p className="text-xs text-slate-600">{formatDate(item.tanggal)}</p>
              </div>
              {item.status === "aktif" &&
                (hasOpenSanksos(sanksos, item.id) ? (
                  <span className="text-sm text-slate-600">Request berjalan</span>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => dispatch(asyncAjukanSanksos(item.id))}
                    className="btn-primary"
                  >
                    Ajukan Sanksos
                  </button>
                ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const role = useSelector((state) => state.auth.user?.role);
  return role === "pembina" ? <PembinaDashboard /> : <MahasiswaDashboard />;
}
