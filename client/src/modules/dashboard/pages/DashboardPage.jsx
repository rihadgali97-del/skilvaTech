import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { userApi } from '../../users/api/userApi';
import { roleApi } from '../../roles/api/roleApi';

const StatCard = ({ label, value, color, loading }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
    <p className="text-slate-400 text-sm mb-1">{label}</p>
    {loading
      ? <div className="h-8 w-16 bg-slate-800 rounded animate-pulse mt-1" />
      : <p className={`text-3xl font-bold ${color}`}>{value}</p>
    }
  </div>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats]     = useState({ users: 0, roles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.allSettled([
          userApi.list({ limit: 1 }),
          roleApi.list(),
        ]);

        setStats({
          users: usersRes.status === 'fulfilled'
            ? usersRes.value.data.pagination.total : '—',
          roles: rolesRes.status === 'fulfilled'
            ? rolesRes.value.data.data.roles.length : '—',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">
        Welcome back, {user?.firstName} 👋
      </h1>
      <p className="text-slate-400 mb-8 text-sm">
        Here's what's happening with your platform today.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"    value={stats.users}  color="text-violet-400" loading={loading} />
        <StatCard label="Roles"          value={stats.roles}  color="text-emerald-400" loading={loading} />
        <StatCard label="Active Courses" value="—"            color="text-amber-400"  loading={false} />
        <StatCard label="Open Tickets"   value="—"            color="text-sky-400"    loading={false} />
      </div>

      {/* Quick actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: '+ New User',  href: '/dashboard/users' },
            { label: '+ New Role',  href: '/dashboard/roles' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700
                         text-sm text-slate-300 hover:text-white transition-all"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;