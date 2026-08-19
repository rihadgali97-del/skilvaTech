import prisma from '../../config/db.js';
import { sendSuccess } from '../../shared/utils/response.utils.js';

// ─── Helper: last N months as labels ──────────────────────────────────────────
const getLastNMonths = (n = 6) => {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push({
      year:  d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    });
  }
  return months;
};

// ─── GET /api/v1/analytics/overview ──────────────────────────────────────────
export const getOverview = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo  = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue, revenueThisMonth, revenuePrevMonth,
      totalClients, newClientsThisMonth, newClientsPrevMonth,
      openTickets, resolvedThisMonth,
      activeEnrollments, newEnrollmentsThisMonth,
      totalLeads, convertedLeads,
    ] = await Promise.all([
      // Revenue
      prisma.invoice.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      prisma.invoice.aggregate({ where: { status: 'paid', paidAt: { gte: thirtyDaysAgo } }, _sum: { amount: true } }),
      prisma.invoice.aggregate({ where: { status: 'paid', paidAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }, _sum: { amount: true } }),
      // Clients
      prisma.client.count(),
      prisma.client.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.client.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      // Tickets
      prisma.ticket.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.ticket.count({ where: { status: 'resolved', resolvedAt: { gte: thirtyDaysAgo } } }),
      // Enrollments
      prisma.enrollment.count({ where: { status: 'active' } }),
      prisma.enrollment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      // Leads
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'converted' } }),
    ]);

    const pctChange = (curr, prev) => {
      if (!prev) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    sendSuccess(res, {
      overview: {
        revenue: {
          total:         Number(totalRevenue._sum.amount || 0),
          thisMonth:     Number(revenueThisMonth._sum.amount || 0),
          change:        pctChange(Number(revenueThisMonth._sum.amount || 0), Number(revenuePrevMonth._sum.amount || 0)),
        },
        clients: {
          total:         totalClients,
          newThisMonth:  newClientsThisMonth,
          change:        pctChange(newClientsThisMonth, newClientsPrevMonth),
        },
        tickets: {
          open:          openTickets,
          resolvedThisMonth,
        },
        enrollments: {
          active:        activeEnrollments,
          newThisMonth:  newEnrollmentsThisMonth,
        },
        leads: {
          total:         totalLeads,
          converted:     convertedLeads,
          conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
        },
      },
    });
  } catch (err) { next(err); }
};

// ─── GET /api/v1/analytics/revenue ───────────────────────────────────────────
export const getRevenueChart = async (req, res, next) => {
  try {
    const months = getLastNMonths(6);

    const data = await Promise.all(
      months.map(async ({ year, month, label }) => {
        const start = new Date(year, month - 1, 1);
        const end   = new Date(year, month, 1);

        const [paid, sent, overdue] = await Promise.all([
          prisma.invoice.aggregate({ where: { status: 'paid',    paidAt:    { gte: start, lt: end } }, _sum: { amount: true } }),
          prisma.invoice.aggregate({ where: { status: 'sent',    createdAt: { gte: start, lt: end } }, _sum: { amount: true } }),
          prisma.invoice.aggregate({ where: { status: 'overdue', createdAt: { gte: start, lt: end } }, _sum: { amount: true } }),
        ]);

        return {
          month: label,
          paid:    Number(paid._sum.amount    || 0),
          pending: Number(sent._sum.amount    || 0),
          overdue: Number(overdue._sum.amount || 0),
        };
      })
    );

    sendSuccess(res, { revenue: data });
  } catch (err) { next(err); }
};

// ─── GET /api/v1/analytics/leads ─────────────────────────────────────────────
export const getLeadsFunnel = async (req, res, next) => {
  try {
    const statuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];

    const counts = await Promise.all(
      statuses.map((status) => prisma.lead.count({ where: { status } }))
    );

    const sources = await prisma.lead.groupBy({
      by: ['source'],
      _count: { source: true },
      orderBy: { _count: { source: 'desc' } },
      take: 6,
    });

    const monthlyLeads = await Promise.all(
      getLastNMonths(6).map(async ({ year, month, label }) => {
        const start = new Date(year, month - 1, 1);
        const end   = new Date(year, month, 1);
        const count = await prisma.lead.count({ where: { createdAt: { gte: start, lt: end } } });
        return { month: label, leads: count };
      })
    );

    sendSuccess(res, {
      funnel: statuses.map((status, i) => ({ status, count: counts[i] })),
      sources: sources.map((s) => ({ source: s.source || 'unknown', count: s._count.source })),
      monthly: monthlyLeads,
    });
  } catch (err) { next(err); }
};

// ─── GET /api/v1/analytics/tickets ───────────────────────────────────────────
export const getTicketsAnalytics = async (req, res, next) => {
  try {
    const [byStatus, byPriority, byType, monthlyCreated, monthlyResolved] = await Promise.all([
      prisma.ticket.groupBy({ by: ['status'],   _count: { status: true } }),
      prisma.ticket.groupBy({ by: ['priority'], _count: { priority: true } }),
      prisma.ticket.groupBy({ by: ['type'],     _count: { type: true } }),

      Promise.all(
        getLastNMonths(6).map(async ({ year, month, label }) => {
          const start = new Date(year, month - 1, 1);
          const end   = new Date(year, month, 1);
          const count = await prisma.ticket.count({ where: { createdAt: { gte: start, lt: end } } });
          return { month: label, tickets: count };
        })
      ),

      Promise.all(
        getLastNMonths(6).map(async ({ year, month, label }) => {
          const start = new Date(year, month - 1, 1);
          const end   = new Date(year, month, 1);
          const count = await prisma.ticket.count({ where: { status: 'resolved', resolvedAt: { gte: start, lt: end } } });
          return { month: label, resolved: count };
        })
      ),
    ]);

    sendSuccess(res, {
      byStatus:   byStatus.map((s) => ({ status: s.status, count: s._count.status })),
      byPriority: byPriority.map((s) => ({ priority: s.priority, count: s._count.priority })),
      byType:     byType.map((s) => ({ type: s.type, count: s._count.type })),
      monthly:    monthlyCreated.map((m, i) => ({ ...m, resolved: monthlyResolved[i].resolved })),
    });
  } catch (err) { next(err); }
};

// ─── GET /api/v1/analytics/enrollments ───────────────────────────────────────
export const getEnrollmentsAnalytics = async (req, res, next) => {
  try {
    const [byStatus, topCourses, monthlyEnrollments] = await Promise.all([
      prisma.enrollment.groupBy({ by: ['status'], _count: { status: true } }),

      prisma.course.findMany({
        take: 5,
        orderBy: { enrollments: { _count: 'desc' } },
        select: {
          title: true,
          level: true,
          _count: { select: { enrollments: true } },
        },
      }),

      Promise.all(
        getLastNMonths(6).map(async ({ year, month, label }) => {
          const start = new Date(year, month - 1, 1);
          const end   = new Date(year, month, 1);
          const count = await prisma.enrollment.count({ where: { createdAt: { gte: start, lt: end } } });
          return { month: label, enrollments: count };
        })
      ),
    ]);

    sendSuccess(res, {
      byStatus:    byStatus.map((s) => ({ status: s.status, count: s._count.status })),
      topCourses:  topCourses.map((c) => ({ title: c.title, level: c.level, enrollments: c._count.enrollments })),
      monthly:     monthlyEnrollments,
    });
  } catch (err) { next(err); }
};

// ─── GET /api/v1/analytics/clients ───────────────────────────────────────────
export const getClientsAnalytics = async (req, res, next) => {
  try {
    const [topClients, monthlyClients] = await Promise.all([
      prisma.client.findMany({
        take: 5,
        select: {
          name: true,
          company: true,
          invoices: {
            where:   { status: 'paid' },
            select:  { amount: true },
          },
          _count: { select: { projects: true, leads: true } },
        },
      }),

      Promise.all(
        getLastNMonths(6).map(async ({ year, month, label }) => {
          const start = new Date(year, month - 1, 1);
          const end   = new Date(year, month, 1);
          const count = await prisma.client.count({ where: { createdAt: { gte: start, lt: end } } });
          return { month: label, clients: count };
        })
      ),
    ]);

    const topClientsSorted = topClients
      .map((c) => ({
        name:     c.name,
        company:  c.company,
        revenue:  c.invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
        projects: c._count.projects,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    sendSuccess(res, {
      topClients: topClientsSorted,
      monthly:    monthlyClients,
    });
  } catch (err) { next(err); }
};