import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageLoader from '../shared/components/ui/PageLoader';

// ── Public site ────────────────────────────────────────────────────────────────
const PublicLayout   = lazy(() => import('../public/layouts/PublicLayout'));
const HomePage       = lazy(() => import('../public/pages/HomePage'));
const AboutPage      = lazy(() => import('../public/pages/AboutPage'));
const ServicesPage   = lazy(() => import('../public/pages/ServicesPage'));
const CoursesPage    = lazy(() => import('../public/pages/CoursesPage'));
const PricingPage    = lazy(() => import('../public/pages/PricingPage'));
const ContactPage    = lazy(() => import('../public/pages/ContactPage'));
const FAQPage        = lazy(() => import('../public/pages/FAQPage'));

// ── Dashboard shell ────────────────────────────────────────────────────────────
const DashboardLayout = lazy(() => import('../shared/layouts/dashboard-layout/DashboardLayout'));

// ── Auth ──────────────────────────────────────────────────────────────────────
const LoginPage          = lazy(() => import('../modules/auth/pages/LoginPage'));
const RegisterPage       = lazy(() => import('../modules/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../modules/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('../modules/auth/pages/ResetPasswordPage'));

// ── Dashboard pages ───────────────────────────────────────────────────────────
const DashboardPage          = lazy(() => import('../modules/dashboard/pages/DashboardPage'));
const UsersPage              = lazy(() => import('../modules/users/pages/UsersPage'));
const RolesPage              = lazy(() => import('../modules/roles/pages/RolesPage'));
const ServiceCategoriesAdmin = lazy(() => import('../modules/service-categories/pages/ServiceCategoriesPage'));
const ServicesAdminPage      = lazy(() => import('../modules/services/pages/ServicesPage'));
const CoursesAdminPage       = lazy(() => import('../modules/courses/pages/CoursesPage'));
const EnrollmentsPage        = lazy(() => import('../modules/enrollments/pages/EnrollmentsPage'));
const ClientsPage            = lazy(() => import('../modules/clients/pages/ClientsPage'));
const LeadsPage              = lazy(() => import('../modules/leads/pages/LeadsPage'));
const ProjectsPage           = lazy(() => import('../modules/projects/pages/ProjectsPage'));
const TicketsPage            = lazy(() => import('../modules/tickets/pages/TicketsPage'));
const AuditLogsPage          = lazy(() => import('../modules/auditlogs/pages/AuditLogsPage'));
const SettingsPage           = lazy(() => import('../modules/settings/pages/SettingsPage'));
const InvoicesPage           = lazy(() => import('../modules/invoices/pages/InvoicesPage'));
const AnalyticsPage          = lazy(() => import('../modules/analytics/pages/AnalyticsPage'));
const ProfilePage            = lazy(() => import('../modules/profile/pages/ProfilePage'));

const wrap = (C) => <Suspense fallback={<PageLoader />}><C /></Suspense>;

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([

  // ── Public site ──────────────────────────────────────────────────────────────
  {
    element: wrap(PublicLayout),
    children: [
      { path: '/',         element: wrap(HomePage) },
      { path: '/about',    element: wrap(AboutPage) },
      { path: '/services', element: wrap(ServicesPage) },
      { path: '/courses',  element: wrap(CoursesPage) },
      { path: '/pricing',  element: wrap(PricingPage) },
      { path: '/contact',  element: wrap(ContactPage) },
      { path: '/faq',      element: wrap(FAQPage) },
    ],
  },

  // ── Auth ──────────────────────────────────────────────────────────────────────
  { path: '/login',            element: wrap(LoginPage) },
  { path: '/register',         element: wrap(RegisterPage) },
  { path: '/forgot-password',  element: wrap(ForgotPasswordPage) },
  { path: '/reset-password',   element: wrap(ResetPasswordPage) },

  // ── Protected dashboard ───────────────────────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [{
      element: wrap(DashboardLayout),
      children: [
        { path: '/dashboard',                    element: wrap(DashboardPage) },
        { path: '/dashboard/analytics',          element: wrap(AnalyticsPage) },
        { path: '/dashboard/users',              element: wrap(UsersPage) },
        { path: '/dashboard/roles',              element: wrap(RolesPage) },
        { path: '/dashboard/service-categories', element: wrap(ServiceCategoriesAdmin) },
        { path: '/dashboard/services',           element: wrap(ServicesAdminPage) },
        { path: '/dashboard/courses',            element: wrap(CoursesAdminPage) },
        { path: '/dashboard/enrollments',        element: wrap(EnrollmentsPage) },
        { path: '/dashboard/clients',            element: wrap(ClientsPage) },
        { path: '/dashboard/leads',              element: wrap(LeadsPage) },
        { path: '/dashboard/projects',           element: wrap(ProjectsPage) },
        { path: '/dashboard/tickets',            element: wrap(TicketsPage) },
        { path: '/dashboard/audit-logs',         element: wrap(AuditLogsPage) },
        { path: '/dashboard/settings',           element: wrap(SettingsPage) },
        { path: '/dashboard/invoices',           element: wrap(InvoicesPage) },
        { path: '/dashboard/profile',            element: wrap(ProfilePage) },
      ],
    }],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);

const App = () => <RouterProvider router={router} />;
export default App;