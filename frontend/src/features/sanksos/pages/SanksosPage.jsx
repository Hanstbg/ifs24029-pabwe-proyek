import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconInbox, IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { toArray, hasOpenSanksos } from "../../../helpers/dataHelper";
import { showImageDialog, showErrorDialog } from "../../../helpers/toolsHelper";
import BadgeComponent from "../../karma/components/BadgeComponent";
import { asyncFetchSanksos, asyncAksiSanksos, asyncAjukanSanksos } from "../states/action";
import { asyncFetchDemerit } from "../../demerit/states/action";

const MAKS_UKURAN_MB = 5;

// Tampilkan lampiran: gambar -> thumbnail (klik untuk perbesar), file lain -> link unduh
function LampiranComponent({ src, label }) {
  if (!src) return null;
  const isImage = src.startsWith("data:image");
  return (
    <div className="mt-2">
      <p className="text-xs text-slate-500 mb-1">{label}:</p>
      {isImage ? (
        <button type="button" onClick={() => showImageDialog(src, label)} title="Klik untuk memperbesar">
          <img src={src} alt={label} className="w-24 h-24 rounded-lg object-cover border border-slate-300 hover:opacity-80" />
        </button>
      ) : (
        <a href={src} download="bukti-sanksos" className="text-sm font-semibold text-sky-700 underline">
          Unduh / lihat file
        </a>
      )}
    </div>
  );
}

export default function SanksosPage() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const sanksos = toArray(useSelector((state) => state.sanksos.sanksos));
  const demerit = toArray(useSelector((state) => state.demerit.demerit));
  const isLoading = useSelector((state) => state.sanksos.isSanksos);
  const isSubmitting = useSelector((state) => state.sanksos.isSanksosSubmit);

  const [tugas, setTugas] = useState({});
  const [poinVerif, setPoinVerif] = useState({});
  const [buktiKerja, setBuktiKerja] = useState({}); // { [sanksosId]: { data, nama } }

  // Form request sanksos mahasiswa
  const [selectedDemeritId, setSelectedDemeritId] = useState("");
  const [catatanMahasiswa, setCatatanMahasiswa] = useState("");

  const isPembina = role === "pembina";

  useEffect(() => {
    dispatch(asyncFetchSanksos());
    if (!isPembina) {
      dispatch(asyncFetchDemerit());
    }
  }, [dispatch, isPembina]);

  const demeritBisaDiajukan = demerit.filter(
    (d) => d.status === "aktif" && !hasOpenSanksos(sanksos, d.id)
  );

  useEffect(() => {
    if (demeritBisaDiajukan.length > 0 && !selectedDemeritId) {
      setSelectedDemeritId(String(demeritBisaDiajukan[0].id));
    }
  }, [demeritBisaDiajukan, selectedDemeritId]);

  async function handleAjukanSanksos(event) {
    event.preventDefault();
    if (!selectedDemeritId) return;
    const success = await dispatch(
      asyncAjukanSanksos(Number(selectedDemeritId), catatanMahasiswa)
    );
    if (success) {
      setCatatanMahasiswa("");
      setSelectedDemeritId("");
    }
  }

  function handleBuktiKerjaChange(id, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAKS_UKURAN_MB * 1024 * 1024) {
      showErrorDialog(`Ukuran file maksimal ${MAKS_UKURAN_MB} MB.`);
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setBuktiKerja((prev) => ({ ...prev, [id]: { data: reader.result, nama: file.name } }));
    };
    reader.readAsDataURL(file);
  }

  function handleAksi(id, aksi) {
    if (aksi === "dikerjakan") {
      if (!buktiKerja[id]?.data) {
        return showErrorDialog("Upload foto / file bukti pengerjaan dulu sebelum menandai selesai dikerjakan.");
      }
      return dispatch(asyncAksiSanksos(id, "dikerjakan", buktiKerja[id].data));
    }
    if (aksi === "setujui") {
      return dispatch(asyncAksiSanksos(id, "setujui", tugas[id]));
    }
    if (aksi === "selesai") {
      return dispatch(asyncAksiSanksos(id, "selesai", poinVerif[id]));
    }
    return dispatch(asyncAksiSanksos(id, aksi, tugas[id]));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {isPembina ? "Request Sanksos" : "Sanksos Saya"}
      </h1>

      {/* Bagian Request Sanksos untuk Mahasiswa */}
      {!isPembina && (
        <section className="card p-4 sm:p-5 space-y-4" aria-labelledby="ajukan-heading">
          <h2 id="ajukan-heading" className="text-lg font-extrabold text-slate-900">
            Ajukan Permohonan Sanksos
          </h2>

          {demeritBisaDiajukan.length > 0 ? (
            <form onSubmit={handleAjukanSanksos} className="space-y-4" data-testid="form-ajukan-sanksos">
              <div>
                <label
                  htmlFor="sanksos-demerit-select"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Pilih Demerit yang Ingin Diselesaikan
                </label>
                <select
                  id="sanksos-demerit-select"
                  required
                  value={selectedDemeritId}
                  onChange={(e) => setSelectedDemeritId(e.target.value)}
                  className="input-base"
                >
                  {demeritBisaDiajukan.map((d) => (
                    <option key={d.id} value={d.id}>
                      [{d.jenis.toUpperCase()}] {d.alasan} (Sisa poin: {d.poin_sekarang ?? -20})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="sanksos-catatan-input"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Rencana / Catatan Tugas (Opsional)
                </label>
                <textarea
                  id="sanksos-catatan-input"
                  rows={2}
                  value={catatanMahasiswa}
                  onChange={(e) => setCatatanMahasiswa(e.target.value)}
                  className="input-base"
                  placeholder="mis. Saya bersedia membersihkan lorong asrama atau ruang komunal..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? "Mengajukan..." : "Kirim Request Sanksos"}
              </button>
            </form>
          ) : demerit.some((d) => d.status === "aktif") ? (
            <div className="flex items-center gap-2 text-sm text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
              <IconAlertCircle size={20} className="shrink-0" />
              <span>
                Kamu memiliki request Sanksos yang sedang diproses. Mohon selesaikan tugas yang telah disetujui.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <IconCheck size={20} className="shrink-0" />
              <span>Kamu tidak memiliki kartu demerit aktif saat ini. Pertahankan perilaku baikmu!</span>
            </div>
          )}
        </section>
      )}

      {/* Daftar Request Sanksos */}
      <div className="card p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">
          {isPembina ? "Daftar Permohonan" : "Riwayat Sanksos"}
        </h2>

        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat data Sanksos...
          </p>
        )}

        {!isLoading && sanksos.length === 0 && (
          <div className="flex flex-col items-center text-center py-10 text-slate-600">
            <IconInbox size={40} stroke={1.3} />
            <p className="text-sm mt-2">Belum ada request Sanksos.</p>
          </div>
        )}

        <ul className="divide-y divide-slate-100">
          {sanksos.map((item) => (
            <li key={item.id} className="py-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isPembina && <b className="text-slate-900">{item.nama}</b>}
                  <BadgeComponent value={item.jenis_demerit} />
                  <BadgeComponent value={item.status} />
                  {item.poin_sekarang !== undefined && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Sisa: {item.poin_sekarang} poin
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{item.alasan}</p>
                {item.catatan && (
                  <p className="text-sm text-slate-700">
                    {isPembina ? "Catatan mahasiswa" : "Catatanmu"}: {item.catatan}
                  </p>
                )}
                {item.tugas && (
                  <p className="text-sm text-slate-700">
                    Tugas: <b>{item.tugas}</b>
                  </p>
                )}
                <LampiranComponent src={item.bukti_foto} label="Lampiran awal" />
                <LampiranComponent src={item.bukti_selesai} label="Bukti pengerjaan" />
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:min-w-64">
                {isPembina && item.status === "diajukan" && (
                  <>
                    <input
                      aria-label={`Tugas sanksos untuk ${item.nama}`}
                      placeholder="Tugas sanksos (mis. bersihkan selasar)"
                      value={tugas[item.id] ?? ""}
                      onChange={(event) => setTugas({ ...tugas, [item.id]: event.target.value })}
                      className="input-base"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAksi(item.id, "setujui")}
                      className="btn-primary"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAksi(item.id, "tolak")}
                      className="btn-ghost"
                    >
                      Tolak
                    </button>
                  </>
                )}
                {isPembina && item.status === "dikerjakan" && (
                  <div className="flex items-center gap-2">
                    <input
                      aria-label={`Poin sanksos untuk ${item.nama}`}
                      type="number"
                      placeholder="+ Poin (mis. 10)"
                      value={poinVerif[item.id] ?? ""}
                      onChange={(event) =>
                        setPoinVerif({ ...poinVerif, [item.id]: event.target.value })
                      }
                      className="input-base w-32"
                    />
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAksi(item.id, "selesai")}
                      className="btn-primary"
                    >
                      Verifikasi selesai
                    </button>
                  </div>
                )}
                {!isPembina && (item.status === "disetujui" || (item.status === "dikerjakan" && !item.bukti_selesai)) && (
                  <div className="w-full space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Upload foto / file bukti pengerjaan (wajib)
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleBuktiKerjaChange(item.id, e)}
                        className="input-base mt-1"
                      />
                    </label>
                    {buktiKerja[item.id]?.data?.startsWith("data:image") && (
                      <img
                        src={buktiKerja[item.id].data}
                        alt="Pratinjau bukti pengerjaan"
                        className="w-20 h-20 rounded-lg object-cover border border-slate-300"
                      />
                    )}
                    {buktiKerja[item.id] && !buktiKerja[item.id].data.startsWith("data:image") && (
                      <p className="text-xs text-slate-600">File: {buktiKerja[item.id].nama}</p>
                    )}
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAksi(item.id, "dikerjakan")}
                      className="btn-primary"
                    >
                      {item.status === "disetujui" ? "Tandai sudah dikerjakan" : "Kirim bukti pengerjaan"}
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}