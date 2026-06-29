import prisma from '../../config/db.js';
import { sendSuccess } from '../../shared/utils/response.utils.js';

// GET /api/v1/search?q=query&limit=5
export const globalSearch = async (req, res, next) => {
  try {
    const q     = (req.query.q || '').trim();
    const limit = Math.min(parseInt(req.query.limit) || 5, 10);

    if (!q || q.length < 2) {
      return sendSuccess(res, { results: [] });
    }

    const contains = { contains: q, mode: 'insensitive' };

    const [users, clients, courses, tickets, leads] = await Promise.all([
      prisma.user.findMany({
        take: limit, where: { OR: [{ firstName: contains }, { lastName: contains }, { email: contains }] },
        select: { id: true, firstName: true, lastName: true, email: true, role: { select: { name: true } } },
      }),
      prisma.client.findMany({
        take: limit, where: { OR: [{ name: contains }, { email: contains }, { company: contains }] },
        select: { id: true, name: true, email: true, company: true },
      }),
      prisma.course.findMany({
        take: limit, where: { OR: [{ title: contains }, { description: contains }] },
        select: { id: true, title: true, level: true, isPublished: true },
      }),
      prisma.ticket.findMany({
        take: limit, where: { title: contains },
        select: { id: true, title: true, status: true, priority: true },
      }),
      prisma.lead.findMany({
        take: limit, where: { OR: [{ name: contains }, { email: contains }, { company: contains }] },
        select: { id: true, name: true, email: true, status: true },
      }),
    ]);

    const results = [
      ...users.map((u) => ({
        type:     'user',
        id:       u.id,
        title:    `${u.firstName} ${u.lastName}`,
        subtitle: u.email,
        badge:    u.role?.name,
        href:     '/dashboard/users',
        icon:     '👤',
      })),
      ...clients.map((c) => ({
        type:     'client',
        id:       c.id,
        title:    c.name,
        subtitle: c.company || c.email,
        badge:    'Client',
        href:     '/dashboard/clients',
        icon:     '🏢',
      })),
      ...courses.map((c) => ({
        type:     'course',
        id:       c.id,
        title:    c.title,
        subtitle: c.level,
        badge:    c.isPublished ? 'Published' : 'Draft',
        href:     '/dashboard/courses',
        icon:     '📚',
      })),
      ...tickets.map((t) => ({
        type:     'ticket',
        id:       t.id,
        title:    t.title,
        subtitle: t.status,
        badge:    t.priority,
        href:     '/dashboard/tickets',
        icon:     '🎫',
      })),
      ...leads.map((l) => ({
        type:     'lead',
        id:       l.id,
        title:    l.name,
        subtitle: l.email,
        badge:    l.status,
        href:     '/dashboard/leads',
        icon:     '📊',
      })),
    ];

    sendSuccess(res, { results, query: q });
  } catch (err) { next(err); }
};