import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageLoader from '../shared/components/ui/PageLoader';

const DashboardLayout       = lazy(() => import('../shared/layouts/dashboard-layout/DashboardLayout'));

// Auth
const LoginPage             = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage          = lazy(() => import('../modules/auth/pages/RegisterPage'));

// Dashboard
const DashboardPage         = lazy(() => import('../modules/dashboard/pages/DashboardPage'));

// Phase 2
const UsersPage             = lazy(() => import('../modules/users/pages/UsersPage'));
const RolesPage             = lazy(() => import('../modules/roles/pages/RolesPage'));

// Phase 3
const ServiceCategoriesPage = lazy(() => import('../modules/service-categories/pages/ServiceCategoriesPage'));
const ServicesPage          = lazy(() => import('../modules/services/pages/ServicesPage'));

// Phase 4
const CoursesPage           = lazy(() => import('../modules/courses/pages/CoursesPage'));
const EnrollmentsPage       = lazy(() => import('../modules/enrollments/pages/EnrollmentsPage'));

// Phase 5
const ClientsPage           = lazy(() => import('../modules/clients/pages/ClientsPage'));
const LeadsPage             = lazy(() => import('../modules/leads/pages/LeadsPage'));
const ProjectsPage          = lazy(() => import('../modules/projects/pages/ProjectsPage'));
const TicketsPage           = lazy(() => import('../modules/tickets/pages/TicketsPage'));

// Phase 6
const AuditLogsPage         = lazy(() => import('../modules/auditlogs/pages/AuditLogsPage'));

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
        { path: '/dashboard/courses',            element: wrap(CoursesPage) },
        { path: '/dashboard/enrollments',        element: wrap(EnrollmentsPage) },
        { path: '/dashboard/clients',            element: wrap(ClientsPage) },
        { path: '/dashboard/leads',              element: wrap(LeadsPage) },
        { path: '/dashboard/projects',           element: wrap(ProjectsPage) },
        { path: '/dashboard/tickets',            element: wrap(TicketsPage) },
        { path: '/dashboard/audit-logs',         element: wrap(AuditLogsPage) },
      ],
    }],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);

const App = () => <RouterProvider router={router} />;
export default App;