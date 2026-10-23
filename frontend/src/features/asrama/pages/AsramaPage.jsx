import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchAsrama } from "../states/action";
import { toArray, getInitial } from "../../../helpers/dataHelper";

export default function AsramaPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.asrama);

  useEffect(() => {
    dispatch(asyncFetchAsrama());
  }, [dispatch]);

  if (loading) return <p className="text-slate-600">Memuat data asrama...</p>;

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-4">Daftar Asrama</h1>
      <div className="space-y-3">
        {toArray(list).map((a) => (
          <details key={a.nama} className="rounded-xl border border-slate-200 bg-white p-4">
            <summary className="cursor-pointer font-semibold text-slate-900">
              {a.nama}{" "}
              <span className="text-sm font-normal text-slate-500">
                ({a.jumlah_mahasiswa} mahasiswa)
              </span>
            </summary>
            {a.mahasiswa.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">Belum ada mahasiswa.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {a.mahasiswa.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 text-sm text-slate-700">
                    {m.foto ? (
                      <img src={m.foto} alt={m.nama} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold">
                        {getInitial(m.nama)}
                      </span>
                    )}
                    <span>{m.nama} ({m.nim})</span>
                  </li>
                ))}
              </ul>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}