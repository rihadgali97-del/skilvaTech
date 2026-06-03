import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Wraps all dashboard routes. Redirects unauthenticated users to /login,
// preserving the intended destination for post-login redirect.
const ProtectedRoute = ({ requiredPermission, requiredRole }) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;