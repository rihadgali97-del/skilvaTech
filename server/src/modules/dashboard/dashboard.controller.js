import prisma from '../../config/db.js';
import { sendSuccess } from '../../shared/utils/response.utils.js';

// ─── Action → human-readable label + icon ─────────────────────────────────────
const ACTION_MAP = {
  'user.created':       { label: 'New user registered',     icon: '👤', color: 'blue'   },
  'user.updated':       { label: 'User profile updated',    icon: '✏️', color: 'gray'   },
  'user.deleted':       { label: 'User deleted',            icon: '🗑', color: 'red'    },
  'client.created':     { label: 'New client added',        icon: '🏢', color: 'teal'   },
  'client.updated':     { label: 'Client updated',          icon: '✏️', color: 'gray'   },
  'client.deleted':     { label: 'Client removed',          icon: '🗑', color: 'red'    },
  'lead.created':       { label: 'New lead captured',       icon: '📊', color: 'blue'   },
  'lead.updated':       { label: 'Lead status updated',     icon: '🔄', color: 'yellow' },
  'project.created':    { label: 'New project started',     icon: '📁', color: 'teal'   },
  'project.updated':    { label: 'Project updated',         icon: '✏️', color: 'gray'   },
  'ticket.created':     { label: 'New ticket opened',       icon: '🎫', color: 'orange' },
  'ticket.updated':     { label: 'Ticket status changed',   icon: '🔄', color: 'yellow' },
  'course.created':     { label: 'New course created',      icon: '📚', color: 'teal'   },
  'course.updated':     { label: 'Course updated',          icon: '✏️', color: 'gray'   },
  'enrollment.created': { label: 'Student enrolled',        icon: '🎓', color: 'green'  },
  'auth.login':         { label: 'User logged in',          icon: '🔐', color: 'gray'   },
  'auth.logout':        { label: 'User logged out',         icon: '🔓', color: 'gray'   },
};

const formatActivity = (log) => {
  const action = ACTION_MAP[log.action] || {
    label: log.action, icon: '📋', color: 'gray',
  };

  return {
    id:         log.id,
    icon:       action.icon,
    color:      action.color,
    label:      action.label,
    resource:   log.resource,
    resourceId: log.resourceId,
    metadata:   log.metadata,
    actor:      log.userId
      ? `${log.metadata?.actorName || 'A user'}`
      : 'System',
    createdAt:  log.createdAt,
    timeAgo:    timeAgo(log.createdAt),
  };
};

const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60)   return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// GET /api/v1/dashboard/activity
export const getActivity = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const logs = await prisma.auditLog.findMany({
      take:    limit,
      orderBy: { createdAt: 'desc' },
      where: {
        // Exclude noisy read events
        NOT: { action: { in: ['auth.login', 'auth.logout'] } },
      },
    });

    sendSuccess(res, {
      activities: logs.map(formatActivity),
    });
  } catch (err) { next(err); }
};

// GET /api/v1/dashboard/stats
export const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, activeUsers,
      totalClients, totalLeads,
      totalCourses, totalEnrollments,
      openTickets, totalProjects,
      recentClients, recentLeads,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.client.count(),
      prisma.lead.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.enrollment.count({ where: { status: 'active' } }),
      prisma.ticket.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.project.count({ where: { status: { in: ['planning', 'active'] } } }),
      // Last 30 days
      prisma.client.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.lead.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    sendSuccess(res, {
      stats: {
        users:       { total: totalUsers,       active: activeUsers },
        clients:     { total: totalClients,     newThisMonth: recentClients },
        leads:       { total: totalLeads,        newThisMonth: recentLeads },
        courses:     { published: totalCourses,  enrollments: totalEnrollments },
        tickets:     { open: openTickets },
        projects:    { active: totalProjects },
      },
    });
  } catch (err) { next(err); }
};