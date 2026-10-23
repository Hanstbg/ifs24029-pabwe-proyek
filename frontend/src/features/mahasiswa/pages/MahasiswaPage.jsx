import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toArray, DAFTAR_ASRAMA, getInitial } from "../../../helpers/dataHelper";
import useInput from "../../../hooks/useInput";
import { asyncFetchMahasiswa, asyncAddMahasiswa, asyncUpdateKamar } from "../states/action";

export default function MahasiswaPage() {
  const dispatch = useDispatch();
  const mahasiswa = toArray(useSelector((state) => state.mahasiswa.mahasiswa));
  const isLoading = useSelector((state) => state.mahasiswa.isMahasiswa);
  const isAdding = useSelector((state) => state.mahasiswa.isMahasiswaAdd);

  const [filterAsrama, setFilterAsrama] = useState("");
  const [nama, onNamaChange, , resetNama] = useInput("");
  const [nim, onNimChange, , resetNim] = useInput("");
  const [password, onPasswordChange, , resetPassword] = useInput("");
  const [asrama, onAsramaChange, , resetAsrama] = useInput(DAFTAR_ASRAMA[0]);
  const [kamar, onKamarChange, , resetKamar] = useInput("");
  const [foto, setFoto] = useState("");

  useEffect(() => {
    dispatch(asyncFetchMahasiswa());
  }, [dispatch]);

  function handleFotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const success = await dispatch(asyncAddMahasiswa({ nama, nim, password, asrama, kamar, foto }));
    if (success) {
      resetNama();
      resetNim();
      resetPassword();
      resetAsrama();
      resetKamar();
      setFoto("");
    }
  }

  const filteredMahasiswa = mahasiswa.filter((item) =>
    filterAsrama ? item.asrama === filterAsrama : true
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Mahasiswa</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-asrama-select" className="text-sm font-semibold text-slate-700">
            Filter Asrama:
          </label>
          <select
            id="filter-asrama-select"
            value={filterAsrama}
            onChange={(e) => setFilterAsrama(e.target.value)}
            className="input-base py-1.5 px-3 text-sm"
          >
            <option value="">Semua Asrama ({mahasiswa.length})</option>
            {DAFTAR_ASRAMA.map((dorm) => {
              const count = mahasiswa.filter((m) => m.asrama === dorm).length;
              return (
                <option key={dorm} value={dorm}>
                  {dorm} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <section className="card p-4 sm:p-5" aria-labelledby="rekap-heading">
        <h2 id="rekap-heading" className="text-lg font-extrabold text-slate-900 mb-3">
          Rekap Mahasiswa
        </h2>
        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat data mahasiswa...
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600 border-b border-slate-200">
                <th className="py-2 pr-3 font-semibold">Mahasiswa</th>
                <th className="py-2 pr-3 font-semibold">NIM</th>
                <th className="py-2 pr-3 font-semibold">Asrama</th>
                <th className="py-2 pr-3 font-semibold">Kamar</th>
                <th className="py-2 pr-3 font-semibold">Peringatan</th>
                <th className="py-2 pr-3 font-semibold">Kuning</th>
                <th className="py-2 pr-3 font-semibold">Merah</th>
                <th className="py-2 font-semibold">Poin Aktif</th>
              </tr>
            </thead>
            <tbody>
              {filteredMahasiswa.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0 align-middle">
                  <td className="py-2.5 pr-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      {item.foto ? (
                        <img
                          src={item.foto}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {getInitial(item.nama)}
                        </span>
                      )}
                      <span>{item.nama}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3">{item.nim}</td>
                  <td className="py-2.5 pr-3">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {item.asrama || "Belum ditentukan"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <input
                      aria-label={`Kamar ${item.nama}`}
                      defaultValue={item.kamar ?? ""}
                      placeholder="-"
                      onBlur={(e) => {
                        if (e.target.value.trim() !== (item.kamar ?? "")) {
                          dispatch(asyncUpdateKamar(item.id, e.target.value));
                        }
                      }}
                      className="input-base w-20 py-1 px-2 text-sm"
                    />
                  </td>
                  <td className="py-2.5 pr-3">{item.peringatan_berjalan} / 3</td>
                  <td className="py-2.5 pr-3">{item.kuning_aktif} / 2</td>
                  <td className="py-2.5 pr-3">{item.merah_aktif}</td>
                  <td className="py-2.5 font-semibold text-rose-600">
                    {item.total_poin_demerit ?? 0} poin
                  </td>
                </tr>
              ))}
              {!isLoading && filteredMahasiswa.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-600">
                    {filterAsrama ? `Belum ada mahasiswa di ${filterAsrama}` : "Belum ada mahasiswa"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-4" data-testid="mahasiswa-form">
        <h2 className="text-lg font-extrabold text-slate-900">Tambah Mahasiswa</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="mahasiswa-nama-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama
            </label>
            <input id="mahasiswa-nama-input" required value={nama} onChange={onNamaChange} className="input-base" />
          </div>
          <div>
            <label htmlFor="mahasiswa-nim-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              NIM
            </label>
            <input id="mahasiswa-nim-input" required value={nim} onChange={onNimChange} className="input-base" />
          </div>
          <div>
            <label htmlFor="mahasiswa-password-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password awal
            </label>
            <input
              id="mahasiswa-password-input"
              required
              value={password}
              onChange={onPasswordChange}
              className="input-base"
            />
          </div>
          <div>
            <label htmlFor="mahasiswa-asrama-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Asrama
            </label>
            <select
              id="mahasiswa-asrama-select"
              value={asrama}
              onChange={onAsramaChange}
              className="input-base"
            >
              {DAFTAR_ASRAMA.map((dorm) => (
                <option key={dorm} value={dorm}>
                  {dorm}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mahasiswa-kamar-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Kamar
            </label>
            <input id="mahasiswa-kamar-input" value={kamar} onChange={onKamarChange} className="input-base" placeholder="mis. 101" />
          </div>
        </div>

        <div>
          <label htmlFor="mahasiswa-foto-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Foto Mahasiswa (Opsional)
          </label>
          <input
            id="mahasiswa-foto-input"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="input-base max-w-md"
          />
          {foto && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={foto}
                alt="Pratinjau foto"
                className="w-12 h-12 rounded-full object-cover border border-slate-300"
              />
              <button
                type="button"
                onClick={() => setFoto("")}
                className="text-xs text-rose-600 hover:underline"
              >
                Hapus foto
              </button>
            </div>
          )}
        </div>

        <button type="submit" disabled={isAdding} className="btn-primary">
          {isAdding ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}