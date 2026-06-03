import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// ─── Layouts ──────────────────────────────────────────────────────────────────
import AuthLayout     from '../shared/layouts/auth-layout/AuthLayout';
import DashboardLayout from '../shared/layouts/dashboard-layout/DashboardLayout';
import ProtectedRoute  from '../shared/components/ui/ProtectedRoute';
import PageLoader      from '../shared/components/loaders/PageLoader';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const LoginPage    = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../modules/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../modules/auth/pages/ForgotPasswordPage'));
const DashboardPage = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const NotFoundPage  = lazy(() => import('../shared/components/ui/NotFoundPage'));

// ─── Wrap with suspense ───────────────────────────────────────────────────────
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // ── Auth routes ─────────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',           element: withSuspense(LoginPage) },
      { path: '/register',        element: withSuspense(RegisterPage) },
      { path: '/forgot-password', element: withSuspense(ForgotPasswordPage) },
    ],
  },

  // ── Dashboard routes (protected) ────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard',         element: withSuspense(DashboardPage) },
          // Phase 2+ routes added here as modules are built
        ],
      },
    ],
  },

  // ── Catch-all ────────────────────────────────────────────────────────────────
  { path: '*', element: withSuspense(NotFoundPage) },
]);