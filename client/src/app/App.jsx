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
        // Core
        { path: '/dashboard',                    element: wrap(DashboardPage) },

        // Phase 2
        { path: '/dashboard/users',              element: wrap(UsersPage) },
        { path: '/dashboard/roles',              element: wrap(RolesPage) },

        // Phase 3
        { path: '/dashboard/service-categories', element: wrap(ServiceCategoriesPage) },
        { path: '/dashboard/services',           element: wrap(ServicesPage) },

        // Phase 4
        { path: '/dashboard/courses',            element: wrap(CoursesPage) },
        { path: '/dashboard/enrollments',        element: wrap(EnrollmentsPage) },

        // Phase 5
        { path: '/dashboard/clients',            element: wrap(ClientsPage) },
        { path: '/dashboard/leads',              element: wrap(LeadsPage) },
        { path: '/dashboard/projects',           element: wrap(ProjectsPage) },
        { path: '/dashboard/tickets',            element: wrap(TicketsPage) },
      ],
    }],
  },

  { path: '*', element: <Navigate to="/login" replace /> },
]);

const App = () => <RouterProvider router={router} />;
export default App;