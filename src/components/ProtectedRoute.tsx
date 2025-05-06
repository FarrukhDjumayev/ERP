import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Token yo‘q bo‘lsa /login ga redirect
    return <Navigate to="/login" replace />;
  }

  // Token bor bo‘lsa, ichidagi sahifani ko‘rsat
  return <Outlet />;
};

export default ProtectedRoute;
