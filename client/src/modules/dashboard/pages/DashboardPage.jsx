import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { userApi } from '../../users/api/userApi';
import { courseApi } from '../../courses/api/courseApi';
import { clientApi } from '../../clients/api/clientApi';
import { ticketApi } from '../../tickets/api/ticketApi';

const StatCard = ({ label, value, icon, color, loading, href }) => (
  <a href={href}
    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#00d4d4]/30 transition-all block">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
    </div>
    {loading
      ? <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
      : <p className="text-3xl font-bold text-gray-900">{value}</p>
    }
  </a>
);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats]     = useState({ users: 0, courses: 0, clients: 0, tickets: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      userApi.list({ limit: 1 }),
      courseApi.list({ limit: 1 }),
      clientApi.list({ limit: 1 }),
      ticketApi.list({ limit: 1, status: 'open' }),
    ]).then(([u, c, cl, t]) => {
      setStats({
        users:   u.status  === 'fulfilled' ? u.value.data.pagination.total  : '—',
        courses: c.status  === 'fulfilled' ? c.value.data.pagination.total  : '—',
        clients: cl.status === 'fulfilled' ? cl.value.data.pagination.total : '—',
        tickets: t.status  === 'fulfilled' ? t.value.data.pagination.total  : '—',
      });
    }).finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { label: '+ New Client',  href: '/dashboard/clients' },
    { label: '+ New Project', href: '/dashboard/projects' },
    { label: '+ New Ticket',  href: '/dashboard/tickets' },
    { label: '+ New Course',  href: '/dashboard/courses' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-[#00b3b3]">{user?.firstName}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your platform overview for today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"   value={stats.users}   icon="👤" color="bg-[#00d4d4]/10" loading={loading} href="/dashboard/users" />
        <StatCard label="Courses"       value={stats.courses} icon="📚" color="bg-emerald-50"   loading={loading} href="/dashboard/courses" />
        <StatCard label="Clients"       value={stats.clients} icon="🏢" color="bg-blue-50"      loading={loading} href="/dashboard/clients" />
        <StatCard label="Open Tickets"  value={stats.tickets} icon="🎫" color="bg-amber-50"     loading={loading} href="/dashboard/tickets" />
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <a key={action.label} href={action.href}
              className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-[#00d4d4]/10 border border-gray-200
                         hover:border-[#00d4d4]/30 text-sm text-gray-600 hover:text-[#00b3b3] transition-all font-medium">
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;