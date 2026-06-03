import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageLoader from '../shared/components/ui/PageLoader';

// ─── Layouts ──────────────────────────────────────────────────────────────────
const DashboardLayout = lazy(() => import('../shared/layouts/dashboard-layout/DashboardLayout'));

// ─── Auth pages ───────────────────────────────────────────────────────────────
const LoginPage    = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../modules/auth/pages/RegisterPage'));

// ─── Dashboard pages ──────────────────────────────────────────────────────────
const DashboardPage = lazy(() => import('../modules/dashboard/pages/DashboardPage'));

// ─── Phase 2 pages ────────────────────────────────────────────────────────────
const UsersPage = lazy(() => import('../modules/users/pages/UsersPage'));
const RolesPage = lazy(() => import('../modules/roles/pages/RolesPage'));

// ─── Phase 3+ pages added here as built ──────────────────────────────────────

const wrap = (C) => (
  <Suspense fallback={<PageLoader />}>
    <C />
  </Suspense>
);

// ─── Protected route guard ────────────────────────────────────────────────────
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────────
  { path: '/',         element: <Navigate to="/login" replace /> },
  { path: '/login',    element: wrap(LoginPage) },
  { path: '/register', element: wrap(RegisterPage) },

  // ── Protected ────────────────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: wrap(DashboardLayout),
        children: [
          { path: '/dashboard',       element: wrap(DashboardPage) },
          { path: '/dashboard/users', element: wrap(UsersPage) },
          { path: '/dashboard/roles', element: wrap(RolesPage) },
          // Phase 3+ routes added here
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);

const App = () => <RouterProvider router={router} />;
export default App;