import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { asyncLoginUser } from "../states/action";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLogin);
  const [nim, onNimChange] = useInput("");
  const [password, onPasswordChange] = useInput("");

  async function handleSubmit(event) {
    event.preventDefault();
    const success = await dispatch(asyncLoginUser({ nim, password }));
    if (success) navigate("/", { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Selamat datang</h1>
      <p className="text-sm text-slate-600 mb-5">Masuk dengan NIM atau username Bapak Asrama.</p>

      <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
        <div>
          <label htmlFor="login-nim-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            NIM / Username
          </label>
          <input
            id="login-nim-input"
            type="text"
            required
            value={nim}
            onChange={onNimChange}
            className="input-base"
          />
        </div>
        <div>
          <label htmlFor="login-password-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Kata Sandi
          </label>
          <input
            id="login-password-input"
            type="password"
            required
            value={password}
            onChange={onPasswordChange}
            className="input-base"
          />
        </div>
        <button
          id="login-submit-button"
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3"
        >
          {isLoading ? "Memproses..." : "Masuk Sekarang"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Belum punya akun mahasiswa?{" "}
        <Link to="/auth/register" className="font-semibold text-slate-900 underline hover:text-slate-700">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
