import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Membatasi halaman untuk satu peran. Peran lain dikembalikan ke dashboard.
export default function RequireRole({ role, children }) {
  const user = useSelector((state) => state.auth.user);
  if (user?.role !== role) return <Navigate to="/" replace />;
  return children;
}
