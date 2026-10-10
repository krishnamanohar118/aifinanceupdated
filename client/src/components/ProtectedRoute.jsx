import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./States";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(),
    location = useLocation();
  if (loading) return <Loading label="Restoring your secure session..." />;
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
