import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import NotificationBell from '../../../shared/components/ui/NotificationBell';
import GlobalSearch from '../../../shared/components/ui/GlobalSearch';
import { withOnboarding } from '../../../shared/components/ui/OnboardingModal';

const navGroups = [
  {
    label: 'General',
    items: [
      { label: 'Dashboard',  path: '/dashboard',           icon: '▦',  permission: null },
      { label: 'Analytics',  path: '/dashboard/analytics', icon: '📊', permission: 'analytics:read' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'My Profile', path: '/dashboard/profile',    icon: '👤', permission: null },
      { label: 'Users',      path: '/dashboard/users',      icon: '👤', permission: 'users:read' },
      { label: 'Roles',      path: '/dashboard/roles',      icon: '🔑', permission: 'roles:read' },
      { label: 'Audit Logs', path: '/dashboard/audit-logs', icon: '📋', permission: 'audit:read' },
      { label: 'Settings',   path: '/dashboard/settings',   icon: '⚙️', permission: 'settings:read' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Categories', path: '/dashboard/service-categories', icon: '📂', permission: 'services:read' },
      { label: 'Services',   path: '/dashboard/services',           icon: '🔧', permission: 'services:read' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { label: 'Courses',     path: '/dashboard/courses',     icon: '📚', permission: 'courses:read' },
      { label: 'Enrollments', path: '/dashboard/enrollments', icon: '🎓', permission: 'enrollments:read' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Clients',  path: '/dashboard/clients',  icon: '🏢', permission: 'clients:read' },
      { label: 'Leads',    path: '/dashboard/leads',    icon: '📈', permission: 'clients:read' },
      { label: 'Projects', path: '/dashboard/projects', icon: '📁', permission: 'projects:read' },
      { label: 'Tickets',  path: '/dashboard/tickets',  icon: '🎫', permission: 'tickets:read' },
      { label: 'Invoices', path: '/dashboard/invoices', icon: '🧾', permission: 'invoices:read' },
    ],
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const { can } = usePermissions();

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`${open ? 'w-64' : 'w-16'} flex-shrink-0 bg-[#0d1f2d] flex flex-col transition-all duration-300`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
          {open ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold text-sm flex-shrink-0">S</div>
              <span className="text-lg font-bold text-white tracking-tight">Skilva<span className="text-[#00d4d4]">Tech</span></span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold text-sm mx-auto">S</div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navGroups.map((group) => {
            const visible = group.items.filter((i) => !i.permission || can(i.permission));
            if (visible.length === 0) return null;
            return (
              <div key={group.label} className="mb-4">
                {open && (
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-1">
                    {group.label}
                  </p>
                )}
                {visible.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all
                       ${isActive
                         ? 'bg-[#00d4d4] text-white'
                         : 'text-white/60 hover:text-white hover:bg-white/10'
                       }`
                    }
                  >
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    {open && <span className="truncate">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>

        {/* User — clickable avatar links to profile */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          {open ? (
            <div className="flex items-center gap-3 p-2">
              <Link to="/dashboard/profile"
                className="w-8 h-8 rounded-full bg-[#00d4d4] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 hover:ring-2 hover:ring-[#00d4d4]/60 transition-all">
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  : initials
                }
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/dashboard/profile" className="text-sm font-medium text-white truncate hover:text-[#00d4d4] transition-colors block">
                  {user?.firstName} {user?.lastName}
                </Link>
                <p className="text-xs text-white/40 truncate capitalize">{user?.role?.name}</p>
              </div>
              <button onClick={logout} title="Logout" className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0 text-sm">⏻</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link to="/dashboard/profile"
                className="w-8 h-8 rounded-full bg-[#00d4d4] flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-[#00d4d4]/60 transition-all">
                {initials}
              </Link>
              <button onClick={logout} className="text-white/40 hover:text-red-400 transition-colors text-sm">⏻</button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shadow-sm">
          <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-[#00b3b3] transition-colors text-lg">
            ☰
          </button>

          {/* Global search */}
          <div className="flex-1">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-px h-6 bg-gray-200" />
            <NavLink to="/dashboard/settings"
              className={({ isActive }) =>
                `w-8 h-8 flex items-center justify-center rounded-xl transition-colors text-sm
                 ${isActive ? 'bg-[#00d4d4]/10 text-[#008080]' : 'text-gray-400 hover:text-[#00b3b3] hover:bg-gray-100'}`
              }
              title="Settings">
              ⚙️
            </NavLink>
            <div className="w-px h-6 bg-gray-200" />
            <span className="text-sm text-gray-500 hidden sm:block">{user?.firstName} {user?.lastName}</span>
            {/* Clickable avatar → profile page */}
            <Link to="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-[#00d4d4] flex items-center justify-center text-xs font-bold text-white hover:ring-2 hover:ring-[#00d4d4]/40 transition-all overflow-hidden"
              title="My Profile">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : initials
              }
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default withOnboarding(DashboardLayout);