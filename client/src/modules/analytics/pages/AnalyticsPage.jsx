import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';

// ─── Colors ───────────────────────────────────────────────────────────────────
const TEAL   = '#00d4d4';
const NAVY   = '#0d1f2d';
const GREEN  = '#10b981';
const AMBER  = '#f59e0b';
const RED    = '#ef4444';
const BLUE   = '#3b82f6';
const PURPLE = '#8b5cf6';

const PIE_COLORS = [TEAL, BLUE, GREEN, AMBER, RED, PURPLE, '#06b6d4', '#84cc16'];

// ─── Reusable components ──────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle }) => (
  <div className="px-6 py-4 border-b border-gray-100">
    <h3 className="font-semibold text-gray-900">{title}</h3>
    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

const StatCard = ({ label, value, sub, change, icon, color = 'teal' }) => {
  const colors = {
    teal:   'bg-[#00d4d4]/10 text-[#00d4d4]',
    green:  'bg-emerald-50 text-emerald-500',
    amber:  'bg-amber-50 text-amber-500',
    red:    'bg-red-50 text-red-500',
    blue:   'bg-blue-50 text-blue-500',
    purple: 'bg-purple-50 text-purple-500',
  };
  const isPositive = change > 0;
  const isNeutral  = change === 0 || change === undefined;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium
          ${isNeutral ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{isNeutral ? '→' : isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}% vs last month</span>
        </div>
      )}
    </Card>
  );
};

const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />
);

const CustomTooltip = ({ active, payload, label, currency = false }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="font-medium text-gray-900 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {currency ? `$${Number(p.value).toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

// ─── Analytics Page ────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const { overview, revenue, leads, tickets, enrollments, clients, loading, error, refetch } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview',    label: 'Overview',    icon: '📊' },
    { id: 'revenue',     label: 'Revenue',     icon: '💰' },
    { id: 'leads',       label: 'Leads',       icon: '📈' },
    { id: 'tickets',     label: 'Tickets',     icon: '🎫' },
    { id: 'enrollments', label: 'Enrollments', icon: '🎓' },
    { id: 'clients',     label: 'Clients',     icon: '🏢' },
  ];

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={refetch} className="px-4 py-2 bg-[#00d4d4] text-white rounded-xl text-sm">
        Retry
      </button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Platform performance overview</p>
        </div>
        <button onClick={refetch}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-[#00b3b3] hover:border-[#00d4d4]/30 transition-all shadow-sm">
          ↻ Refresh
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
          ) : overview && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Total Revenue"    value={`$${Number(overview.revenue.total).toLocaleString()}`}   sub={`$${Number(overview.revenue.thisMonth).toLocaleString()} this month`} change={overview.revenue.change}     icon="💰" color="green" />
                <StatCard label="Total Clients"    value={overview.clients.total}   sub={`+${overview.clients.newThisMonth} new this month`}  change={overview.clients.change}     icon="🏢" color="teal" />
                <StatCard label="Lead Conversion"  value={`${overview.leads.conversionRate}%`} sub={`${overview.leads.converted} of ${overview.leads.total} leads`} icon="📈" color="blue" />
                <StatCard label="Open Tickets"     value={overview.tickets.open}    sub={`${overview.tickets.resolvedThisMonth} resolved this month`} icon="🎫" color="amber" />
                <StatCard label="Active Enrollments" value={overview.enrollments.active} sub={`+${overview.enrollments.newThisMonth} this month`} icon="🎓" color="purple" />
                <StatCard label="Total Leads"      value={overview.leads.total}     sub={`${overview.leads.converted} converted`} icon="📊" color="teal" />
              </div>

              {/* Revenue sparkline */}
              {revenue.length > 0 && (
                <Card>
                  <CardHeader title="Revenue Trend" subtitle="Last 6 months" />
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={revenue}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={TEAL} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip currency />} />
                        <Area type="monotone" dataKey="paid" name="Paid" stroke={TEAL} fill="url(#revGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {/* ── REVENUE TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {loading ? <Skeleton className="h-80" /> : (
            <>
              <Card>
                <CardHeader title="Monthly Revenue Breakdown" subtitle="Paid, pending and overdue invoices by month" />
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `$${v}`} />
                      <Tooltip content={<CustomTooltip currency />} />
                      <Legend />
                      <Bar dataKey="paid"    name="Paid"    fill={GREEN} radius={[4,4,0,0]} />
                      <Bar dataKey="pending" name="Pending" fill={AMBER} radius={[4,4,0,0]} />
                      <Bar dataKey="overdue" name="Overdue" fill={RED}   radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                {revenue.slice(-1).map((m) => (
                  <>
                    <StatCard key="paid"    label="Paid This Month"    value={`$${m.paid.toLocaleString()}`}    icon="✅" color="green" />
                    <StatCard key="pending" label="Pending This Month"  value={`$${m.pending.toLocaleString()}`} icon="⏳" color="amber" />
                    <StatCard key="overdue" label="Overdue This Month"  value={`$${m.overdue.toLocaleString()}`} icon="⚠️" color="red" />
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── LEADS TAB ─────────────────────────────────────────────────────────── */}
      {activeTab === 'leads' && leads && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Lead Funnel" subtitle="Conversion pipeline" />
              <div className="p-6">
                <div className="space-y-3">
                  {leads.funnel.map((item, i) => {
                    const max   = leads.funnel[0]?.count || 1;
                    const pct   = Math.round((item.count / max) * 100);
                    const colors = [TEAL, BLUE, GREEN, AMBER, RED];
                    return (
                      <div key={item.status}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 capitalize">{item.status}</span>
                          <span className="font-semibold text-gray-900">{item.count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: colors[i] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Lead Sources" subtitle="Where leads come from" />
              <div className="p-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={leads.sources} dataKey="count" nameKey="source" cx="50%" cy="50%"
                      outerRadius={80} label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}>
                      {leads.sources.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Monthly Lead Volume" subtitle="New leads per month" />
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={leads.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="leads" name="Leads" stroke={TEAL} strokeWidth={2} dot={{ fill: TEAL }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── TICKETS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'tickets' && tickets && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader title="By Status" />
              <div className="p-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={tickets.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70}>
                      {tickets.byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <CardHeader title="By Priority" />
              <div className="p-6">
                <div className="space-y-3 mt-2">
                  {tickets.byPriority.map((item) => {
                    const colors = { low: 'bg-gray-400', medium: 'bg-blue-400', high: 'bg-amber-400', urgent: 'bg-red-500' };
                    return (
                      <div key={item.priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${colors[item.priority] || 'bg-gray-400'}`} />
                          <span className="text-sm text-gray-600 capitalize">{item.priority}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="By Type" />
              <div className="p-6">
                <div className="space-y-3 mt-2">
                  {tickets.byType.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                      <span className="font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Tickets Created vs Resolved" subtitle="Last 6 months" />
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tickets.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="tickets"  name="Created"  fill={BLUE}  radius={[4,4,0,0]} />
                  <Bar dataKey="resolved" name="Resolved" fill={GREEN} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── ENROLLMENTS TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'enrollments' && enrollments && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Top Courses by Enrollment" />
              <div className="p-6 space-y-3">
                {enrollments.topCourses.map((course, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#00d4d4]/10 text-[#00b3b3] text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{course.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{course.level}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#00b3b3]">{course.enrollments}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Enrollment Status" />
              <div className="p-6">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={enrollments.byStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
                      {enrollments.byStatus.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Monthly Enrollments" subtitle="New enrollments per month" />
            <div className="p-6">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={enrollments.monthly}>
                  <defs>
                    <linearGradient id="enGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke={PURPLE} fill="url(#enGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* ── CLIENTS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'clients' && clients && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Top Clients by Revenue" subtitle="Paid invoices only" />
              <div className="p-6 space-y-3">
                {clients.topClients.map((client, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-xs font-bold text-[#00b3b3] flex-shrink-0">
                        {client.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-400">{client.projects} projects</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">${client.revenue.toLocaleString()}</span>
                  </div>
                ))}
                {clients.topClients.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No revenue data yet — mark some invoices as paid.</p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader title="Monthly New Clients" subtitle="Client acquisition over time" />
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={clients.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="clients" name="New Clients" fill={TEAL} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;