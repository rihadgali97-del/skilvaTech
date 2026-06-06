import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';

const navGroups = [
  {
    label: 'General',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: '▦', permission: null },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users',  path: '/dashboard/users', icon: '👤', permission: 'users:read' },
      { label: 'Roles',  path: '/dashboard/roles', icon: '🔑', permission: 'roles:read' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Categories', path: '/dashboard/service-categories', icon: '📂', permission: 'services:read' },
      { label: 'Services',   path: '/dashboard/services',           icon: '⚙️', permission: 'services:read' },
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
      { label: 'Leads',    path: '/dashboard/leads',    icon: '📊', permission: 'clients:read' },
      { label: 'Projects', path: '/dashboard/projects', icon: '📁', permission: 'projects:read' },
      { label: 'Tickets',  path: '/dashboard/tickets',  icon: '🎫', permission: 'tickets:read' },
    ],
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const { can } = usePermissions();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`${open ? 'w-64' : 'w-16'} flex-shrink-0 bg-[#0d1f2d] flex flex-col transition-all duration-300`}>

        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 flex-shrink-0">
          {open ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold text-sm flex-shrink-0">
                S
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Skilva<span className="text-[#00d4d4]">Tech</span>
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold text-sm mx-auto">
              S
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navGroups.map((group) => {
            const visibleItems = group.items.filter((i) => !i.permission || can(i.permission));
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.label} className="mb-4">
                {open && (
                  <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 mb-1">
                    {group.label}
                  </p>
                )}
                {visibleItems.map((item) => (
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

        {/* User */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          {open ? (
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-[#00d4d4] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-white/40 truncate capitalize">{user?.role?.name}</p>
              </div>
              <button onClick={logout} title="Logout"
                className="text-white/40 hover:text-red-400 transition-colors flex-shrink-0 text-sm">
                ⏻
              </button>
            </div>
          ) : (
            <button onClick={logout}
              className="w-full flex justify-center p-2 text-white/40 hover:text-red-400 transition-colors">
              ⏻
            </button>
          )}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shadow-sm">
          <button onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-[#00b3b3] transition-colors text-lg">
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.firstName} {user?.lastName}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#00d4d4] flex items-center justify-center text-xs font-bold text-white">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
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

export default DashboardLayout;