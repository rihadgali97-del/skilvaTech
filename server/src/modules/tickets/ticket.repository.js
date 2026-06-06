// ticket.repository.js
import prisma from '../../config/db.js';

const ticketSelect = {
  id: true, title: true, description: true, status: true,
  priority: true, type: true, resolvedAt: true,
  createdAt: true, updatedAt: true,
  project:    { select: { id: true, name: true } },
  assignedTo: { select: { id: true, firstName: true, lastName: true } },
  createdBy:  { select: { id: true, firstName: true, lastName: true } },
};

export const findTickets = ({ skip, take, where, orderBy }) =>
  prisma.ticket.findMany({ skip, take, where, orderBy, select: ticketSelect });

export const countTickets = (where) => prisma.ticket.count({ where });

export const findTicketById = (id) =>
  prisma.ticket.findUnique({ where: { id }, select: ticketSelect });

export const createTicket = (data) =>
  prisma.ticket.create({ data, select: ticketSelect });

export const updateTicket = (id, data) =>
  prisma.ticket.update({ where: { id }, data, select: ticketSelect });

export const deleteTicket = (id) =>
  prisma.ticket.delete({ where: { id } });