import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { DAFTAR_ASRAMA } from "../../../helpers/dataHelper";
import { asyncRegisterUser } from "../states/action";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLogin);

  const [nama, onNamaChange] = useInput("");
  const [nim, onNimChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [asrama, onAsramaChange] = useInput(DAFTAR_ASRAMA[0]);
  const [foto, setFoto] = useState("");

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
    const success = await dispatch(
      asyncRegisterUser({ nama, nim, password, asrama, foto })
    );
    if (success) navigate("/", { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Daftar Mahasiswa</h1>
      <p className="text-sm text-slate-600 mb-5">
        Buat akun baru untuk memantau demerit dan mengajukan sanksos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
        <div>
          <label htmlFor="register-nama-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nama Lengkap
          </label>
          <input
            id="register-nama-input"
            type="text"
            required
            value={nama}
            onChange={onNamaChange}
            className="input-base"
            placeholder="mis. Budi Santoso"
          />
        </div>

        <div>
          <label htmlFor="register-nim-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            NIM
          </label>
          <input
            id="register-nim-input"
            type="text"
            required
            value={nim}
            onChange={onNimChange}
            className="input-base"
            placeholder="mis. 123456"
          />
        </div>

        <div>
          <label htmlFor="register-password-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Kata Sandi
          </label>
          <input
            id="register-password-input"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={onPasswordChange}
            className="input-base"
            placeholder="Minimal 6 karakter"
          />
        </div>

        <div>
          <label htmlFor="register-asrama-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nama Asrama
          </label>
          <select
            id="register-asrama-select"
            required
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
          <label htmlFor="register-foto-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Foto Profil (Opsional)
          </label>
          <input
            id="register-foto-input"
            type="file"
            accept="image/*"
            onChange={handleFotoChange}
            className="input-base"
          />
          {foto && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={foto}
                alt="Pratinjau foto profil"
                className="w-14 h-14 rounded-full object-cover border border-slate-300"
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

        <button
          id="register-submit-button"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3"
        >
          {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Sudah memiliki akun?{" "}
        <Link to="/auth/login" className="font-semibold text-slate-900 underline hover:text-slate-700">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}