import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageLoader from '../shared/components/ui/PageLoader';

const DashboardLayout       = lazy(() => import('../shared/layouts/dashboard-layout/DashboardLayout'));
const LoginPage             = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage          = lazy(() => import('../modules/auth/pages/RegisterPage'));
const DashboardPage         = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const UsersPage             = lazy(() => import('../modules/users/pages/UsersPage'));
const RolesPage             = lazy(() => import('../modules/roles/pages/RolesPage'));
const ServiceCategoriesPage = lazy(() => import('../modules/service-categories/pages/ServiceCategoriesPage'));
const ServicesPage          = lazy(() => import('../modules/services/pages/ServicesPage'));

const wrap = (C) => <Suspense fallback={<PageLoader />}><C /></Suspense>;

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  { path: '/',         element: <Navigate to="/login" replace /> },
  { path: '/login',    element: wrap(LoginPage) },
  { path: '/register', element: wrap(RegisterPage) },
  {
    element: <ProtectedRoute />,
    children: [{
      element: wrap(DashboardLayout),
      children: [
        { path: '/dashboard',                    element: wrap(DashboardPage) },
        { path: '/dashboard/users',              element: wrap(UsersPage) },
        { path: '/dashboard/roles',              element: wrap(RolesPage) },
        { path: '/dashboard/service-categories', element: wrap(ServiceCategoriesPage) },
        { path: '/dashboard/services',           element: wrap(ServicesPage) },
      ],
    }],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
]);

const App = () => <RouterProvider router={router} />;
export default App;