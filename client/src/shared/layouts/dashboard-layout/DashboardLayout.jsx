import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { ROUTES } from '../../constants/routes';

const navItems = [
  { label: 'Dashboard',          path: '/dashboard',                    icon: '⬡', permission: null },

  // Phase 2
  { label: 'Users',              path: '/dashboard/users',              icon: '◉', permission: 'users:read' },
  { label: 'Roles',              path: '/dashboard/roles',              icon: '◬', permission: 'roles:read' },

  // Phase 3
  { label: 'Service Categories', path: '/dashboard/service-categories', icon: '◫', permission: 'services:read' },
  { label: 'Services',           path: '/dashboard/services',           icon: '◈', permission: 'services:read' },

  // Phase 4 (uncomment as built)
  // { label: 'Courses',         path: '/dashboard/courses',            icon: '◷', permission: 'courses:read' },

  // Phase 5 (uncomment as built)
  // { label: 'Clients',         path: '/dashboard/clients',            icon: '◎', permission: 'clients:read' },
  // { label: 'Projects',        path: '/dashboard/projects',           icon: '◌', permission: 'projects:read' },
  // { label: 'Tickets',         path: '/dashboard/tickets',            icon: '◧', permission: 'tickets:read' },

  { label: 'Settings',           path: '/dashboard/settings',           icon: '◩', permission: 'settings:read' },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const { can } = usePermissions();

  const visible = navItems.filter((i) => !i.permission || can(i.permission));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${open ? 'w-60' : 'w-16'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300`}>
        <div className="h-16 flex items-center px-4 border-b border-slate-800 flex-shrink-0">
          {open
            ? <span className="text-lg font-bold">skilva<span className="text-violet-400">tech</span></span>
            : <span className="text-lg font-bold text-violet-400 mx-auto">S</span>
          }
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {visible.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all
                 ${isActive
                   ? 'bg-violet-600/20 text-violet-300 border border-violet-500/20'
                   : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                 }`
              }
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {open && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 flex-shrink-0">
          {open ? (
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role?.name}</p>
              </div>
              <button onClick={logout} title="Logout"
                className="text-slate-500 hover:text-red-400 transition-colors text-sm flex-shrink-0">✕</button>
            </div>
          ) : (
            <button onClick={logout}
              className="w-full flex justify-center p-2 text-slate-500 hover:text-red-400 transition-colors">✕</button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 flex items-center px-6 gap-4">
          <button onClick={() => setOpen(!open)}
            className="text-slate-400 hover:text-slate-200 transition-colors text-lg">☰</button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">{user?.firstName} {user?.lastName}</span>
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;