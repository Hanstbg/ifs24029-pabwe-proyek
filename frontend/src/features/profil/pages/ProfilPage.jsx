import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DAFTAR_ASRAMA, getInitial, getRoleLabel } from "../../../helpers/dataHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncUpdateProfil } from "../../auth/states/action";

const MAKS_FOTO_PX = 512;

// Perkecil foto sebelum disimpan supaya ringan (maks 512px, JPEG)
function resizeFoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const skala = Math.min(1, MAKS_FOTO_PX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * skala);
        canvas.height = Math.round(img.height * skala);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isMahasiswa = user?.role === "mahasiswa";

  const [nama, setNama] = useState(user?.nama ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [asrama, setAsrama] = useState(user?.asrama ?? DAFTAR_ASRAMA[0]);
  const [kamar, setKamar] = useState(user?.kamar ?? "");
  const [foto, setFoto] = useState(user?.foto ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleFotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showErrorDialog("File harus berupa gambar.");
      return;
    }
    try {
      setFoto(await resizeFoto(file));
    } catch {
      showErrorDialog("Gagal membaca gambar. Coba file lain.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    const payload = { nama, bio, foto: foto || null };
    if (isMahasiswa) {
      payload.asrama = asrama;
      payload.kamar = kamar;
    }
    await dispatch(asyncUpdateProfil(payload));
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Profil Saya</h1>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-5" data-testid="profil-form">
        <div className="flex items-center gap-4">
          {foto ? (
            <img
              src={foto}
              alt="Foto profil"
              className="w-24 h-24 rounded-full object-cover border border-slate-300"
            />
          ) : (
            <span className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white flex items-center justify-center text-3xl font-bold">
              {getInitial(nama)}
            </span>
          )}
          <div className="space-y-2">
            <label htmlFor="profil-foto-input" className="block text-sm font-semibold text-slate-700">
              Ganti foto profil
            </label>
            <input
              id="profil-foto-input"
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className="input-base max-w-xs"
            />
            {foto && (
              <button
                type="button"
                onClick={() => setFoto("")}
                className="text-xs text-rose-600 hover:underline"
              >
                Hapus foto
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profil-nama-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama
            </label>
            <input
              id="profil-nama-input"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="input-base"
            />
          </div>
          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-1.5">NIM / Peran</span>
            <p className="input-base bg-slate-50 text-slate-600">
              {user?.nim} · {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>

        {isMahasiswa && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profil-asrama-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Asrama
              </label>
              <select
                id="profil-asrama-select"
                value={asrama}
                onChange={(e) => setAsrama(e.target.value)}
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
              <label htmlFor="profil-kamar-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nomor Kamar
              </label>
              <input
                id="profil-kamar-input"
                required
                value={kamar}
                onChange={(e) => setKamar(e.target.value)}
                className="input-base"
                placeholder="mis. 101"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="profil-bio-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Bio
          </label>
          <textarea
            id="profil-bio-input"
            rows={3}
            maxLength={300}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-base"
            placeholder="Ceritakan sedikit tentang dirimu..."
          />
          <p className="text-xs text-slate-500 mt-1">{bio.length} / 300</p>
        </div>

        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}