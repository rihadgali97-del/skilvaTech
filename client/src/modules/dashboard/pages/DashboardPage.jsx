import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import apiClient from '../../../shared/services/apiClient';

// ─── Color map for activity badges ────────────────────────────────────────────
const colorMap = {
  blue:   'bg-blue-50 text-blue-600 border-blue-100',
  teal:   'bg-[#00d4d4]/10 text-[#008080] border-[#00d4d4]/20',
  green:  'bg-emerald-50 text-emerald-600 border-emerald-100',
  red:    'bg-red-50 text-red-600 border-red-100',
  yellow: 'bg-amber-50 text-amber-600 border-amber-100',
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  gray:   'bg-gray-100 text-gray-500 border-gray-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, href, loading }) => (
  <Link to={href}
    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm
               hover:shadow-md hover:border-[#00d4d4]/30 transition-all group block">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="w-9 h-9 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
    {loading
      ? <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
      : <p className="text-3xl font-bold text-gray-900">{value}</p>
    }
    {sub && !loading && (
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    )}
  </Link>
);

// ─── Activity Item ─────────────────────────────────────────────────────────────
const ActivityItem = ({ activity }) => {
  const colors = colorMap[activity.color] || colorMap.gray;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-sm flex-shrink-0 ${colors}`}>
        {activity.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{activity.actor}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{activity.timeAgo}</span>
    </div>
  );
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats]           = useState(null);
  const [activities, setActivities] = useState([]);
  const [statsLoading, setStatsLoading]         = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/dashboard/stats');
      setStats(data.data.stats);
    } catch (_) {}
    finally { setStatsLoading(false); }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/dashboard/activity?limit=15');
      setActivities(data.data.activities);
    } catch (_) {}
    finally { setActivitiesLoading(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchActivity();
    // Refresh activity every 60 seconds
    const interval = setInterval(fetchActivity, 60000);
    return () => clearInterval(interval);
  }, [fetchStats, fetchActivity]);

  const quickActions = [
    { label: '+ New Client',  href: '/dashboard/clients' },
    { label: '+ New Project', href: '/dashboard/projects' },
    { label: '+ New Ticket',  href: '/dashboard/tickets' },
    { label: '+ New Course',  href: '/dashboard/courses' },
    { label: '+ Enroll',      href: '/dashboard/enrollments' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Greeting ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-[#00b3b3]">{user?.firstName}</span> 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Stats grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.users.total ?? '—'}
          sub={`${stats?.users.active ?? 0} active`}
          icon="👤" href="/dashboard/users" loading={statsLoading}
        />
        <StatCard
          label="Clients"
          value={stats?.clients.total ?? '—'}
          sub={`+${stats?.clients.newThisMonth ?? 0} this month`}
          icon="🏢" href="/dashboard/clients" loading={statsLoading}
        />
        <StatCard
          label="Open Tickets"
          value={stats?.tickets.open ?? '—'}
          sub="Needs attention"
          icon="🎫" href="/dashboard/tickets" loading={statsLoading}
        />
        <StatCard
          label="Enrollments"
          value={stats?.courses.enrollments ?? '—'}
          sub={`${stats?.courses.published ?? 0} published courses`}
          icon="🎓" href="/dashboard/enrollments" loading={statsLoading}
        />
      </div>

      {/* ── Second row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Projects"
          value={stats?.projects.active ?? '—'}
          icon="📁" href="/dashboard/projects" loading={statsLoading}
        />
        <StatCard
          label="Leads"
          value={stats?.leads.total ?? '—'}
          sub={`+${stats?.leads.newThisMonth ?? 0} this month`}
          icon="📊" href="/dashboard/leads" loading={statsLoading}
        />
        <StatCard
          label="Published Courses"
          value={stats?.courses.published ?? '—'}
          icon="📚" href="/dashboard/courses" loading={statsLoading}
        />
        <StatCard
          label="Active Users"
          value={stats?.users.active ?? '—'}
          icon="✅" href="/dashboard/users" loading={statsLoading}
        />
      </div>

      {/* ── Main content grid ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <button onClick={fetchActivity}
              className="text-xs text-[#00b3b3] hover:text-[#008080] font-medium transition-colors">
              Refresh
            </button>
          </div>
          <div className="px-6 py-2">
            {activitiesLoading ? (
              <div className="space-y-3 py-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">No activity yet. Start by creating a client or course.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>

        {/* Quick actions + summary */}
        <div className="space-y-4">

          {/* Quick actions */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-[#00d4d4]/5
                             border border-transparent hover:border-[#00d4d4]/20
                             text-sm text-gray-600 hover:text-[#00b3b3] transition-all font-medium">
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CRM summary */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">CRM Summary</h2>
            <div className="space-y-3">
              {[
                { label: 'Total Clients', value: stats?.clients.total, href: '/dashboard/clients', icon: '🏢' },
                { label: 'Total Leads',   value: stats?.leads.total,   href: '/dashboard/leads',   icon: '📊' },
                { label: 'Active Projects', value: stats?.projects.active, href: '/dashboard/projects', icon: '📁' },
                { label: 'Open Tickets', value: stats?.tickets.open, href: '/dashboard/tickets', icon: '🎫' },
              ].map((item) => (
                <Link key={item.label} to={item.href}
                  className="flex items-center justify-between py-2 hover:text-[#00b3b3] transition-colors">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                  <span className="font-semibold text-gray-900">
                    {statsLoading ? <span className="w-6 h-4 bg-gray-100 rounded animate-pulse inline-block" /> : item.value ?? '—'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;