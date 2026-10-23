import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toArray } from "../../../helpers/dataHelper";
import { formatDate } from "../../../helpers/toolsHelper";
import useInput from "../../../hooks/useInput";
import { asyncFetchMahasiswa } from "../../mahasiswa/states/action";
import BadgeComponent from "../../karma/components/BadgeComponent";
import { asyncFetchPelanggaran, asyncAddPelanggaran } from "../states/action";

function CatatForm() {
  const dispatch = useDispatch();
  const mahasiswa = toArray(useSelector((state) => state.mahasiswa.mahasiswa));
  const isAdding = useSelector((state) => state.pelanggaran.isPelanggaranAdd);

  const [userId, onUserIdChange, , resetUserId] = useInput("");
  const [jenis, onJenisChange, , resetJenis] = useInput("peringatan");
  const [poin, onPoinChange, , resetPoin] = useInput("");
  const [deskripsi, onDeskripsiChange, , resetDeskripsi] = useInput("");

  useEffect(() => {
    dispatch(asyncFetchMahasiswa());
  }, [dispatch]);

  // Kelompokkan mahasiswa per kamar (asrama + nomor kamar)
  const daftarKamar = useMemo(() => {
    const map = new Map();
    mahasiswa.forEach((m) => {
      if (!m.kamar) return;
      const key = `${m.asrama || ""}|${m.kamar}`;
      if (!map.has(key)) map.set(key, { key, asrama: m.asrama, kamar: m.kamar, anggota: [] });
      map.get(key).anggota.push(m);
    });
    return [...map.values()].sort((a, b) =>
      `${a.asrama}${a.kamar}`.localeCompare(`${b.asrama}${b.kamar}`, "id", { numeric: true })
    );
  }, [mahasiswa]);

  const kamarTerpilih = userId.startsWith("kamar:")
    ? daftarKamar.find((k) => `kamar:${k.key}` === userId)
    : null;

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = kamarTerpilih
      ? { asrama: kamarTerpilih.asrama, kamar: kamarTerpilih.kamar, jenis, deskripsi }
      : { user_id: userId, jenis, deskripsi };
    if (poin) payload.poin = Number(poin);
    const success = await dispatch(asyncAddPelanggaran(payload));
    if (success) {
      resetUserId();
      resetJenis();
      resetPoin();
      resetDeskripsi();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-4" data-testid="pelanggaran-form">
      <h2 className="text-lg font-extrabold text-slate-900">Catat Pelanggaran</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="pelanggaran-mahasiswa-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Mahasiswa
          </label>
          <select
            id="pelanggaran-mahasiswa-select"
            required
            value={userId}
            onChange={onUserIdChange}
            className="input-base"
          >
            <option value="">-- Pilih mahasiswa / kamar --</option>
            {daftarKamar.length > 0 && (
              <optgroup label="Satu kamar (semua penghuni kena)">
                {daftarKamar.map((k) => (
                  <option key={k.key} value={`kamar:${k.key}`}>
                    Kamar {k.kamar} - {k.asrama} ({k.anggota.length} orang)
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Per mahasiswa">
              {mahasiswa.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} ({item.nim}){item.kamar ? ` - Kamar ${item.kamar}` : ""}
                </option>
              ))}
            </optgroup>
          </select>
          {kamarTerpilih && (
            <p className="text-xs text-slate-600 mt-1.5">
              Akan dicatat untuk: {kamarTerpilih.anggota.map((a) => a.nama).join(", ")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="pelanggaran-jenis-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Jenis
          </label>
          <select id="pelanggaran-jenis-select" value={jenis} onChange={onJenisChange} className="input-base">
            <option value="peringatan">Peringatan biasa</option>
            <option value="kuning">Kartu kuning langsung</option>
            <option value="fatal">Pelanggaran fatal (langsung kartu merah)</option>
          </select>
        </div>
        <div>
          <label htmlFor="pelanggaran-poin-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Poin Demerit (-) (Opsional)
          </label>
          <input
            id="pelanggaran-poin-input"
            type="number"
            value={poin}
            onChange={onPoinChange}
            className="input-base"
            placeholder={jenis === "kuning" ? "-20" : jenis === "fatal" ? "-50" : "-10"}
          />
        </div>
      </div>
      <div>
        <label htmlFor="pelanggaran-deskripsi-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Deskripsi pelanggaran
        </label>
        <textarea
          id="pelanggaran-deskripsi-input"
          required
          rows={3}
          value={deskripsi}
          onChange={onDeskripsiChange}
          className="input-base"
        />
      </div>
      <button type="submit" disabled={isAdding} className="btn-primary">
        {isAdding ? "Mencatat..." : "Catat"}
      </button>
    </form>
  );
}

export default function PelanggaranPage() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const pelanggaran = toArray(useSelector((state) => state.pelanggaran.pelanggaran));
  const isLoading = useSelector((state) => state.pelanggaran.isPelanggaran);
  const isPembina = role === "pembina";

  useEffect(() => {
    dispatch(asyncFetchPelanggaran());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {isPembina ? "Pelanggaran" : "Riwayat Pelanggaran"}
      </h1>

      {isPembina && <CatatForm />}

      <section className="card p-4 sm:p-5" aria-labelledby="riwayat-heading">
        <h2 id="riwayat-heading" className="text-lg font-extrabold text-slate-900 mb-3">
          Riwayat
        </h2>
        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat riwayat pelanggaran...
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Tanggal</th>
                <th className="py-2 pr-3 font-semibold">Mahasiswa</th>
                <th className="py-2 pr-3 font-semibold">Jenis</th>
                <th className="py-2 font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {pelanggaran.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 align-top">
                  <td className="py-2.5 pr-3 whitespace-nowrap">{formatDate(item.tanggal)}</td>
                  <td className="py-2.5 pr-3">{item.nama}</td>
                  <td className="py-2.5 pr-3">
                    <BadgeComponent
                      value={item.jenis === "fatal" ? "merah" : item.jenis === "kuning" ? "kuning" : "peringatan"}
                    />
                  </td>
                  <td className="py-2.5">{item.deskripsi}</td>
                </tr>
              ))}
              {!isLoading && pelanggaran.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-600">
                    Belum ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}