import * as ticketRepo from './ticket.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';

export const listTickets = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'title', 'priority', 'status']);
  const where = {};
  if (query.search)       where.title       = { contains: query.search, mode: 'insensitive' };
  if (query.status)       where.status      = query.status;
  if (query.priority)     where.priority    = query.priority;
  if (query.type)         where.type        = query.type;
  if (query.projectId)    where.projectId   = query.projectId;
  if (query.assignedToId) where.assignedToId = query.assignedToId;

  const [data, total] = await Promise.all([
    ticketRepo.findTickets({ skip, take: limit, where, orderBy }),
    ticketRepo.countTickets(where),
  ]);
  return { data, total, page, limit };
};

export const getTicketById = async (id) => {
  const ticket = await ticketRepo.findTicketById(id);
  if (!ticket) throw new NotFoundError('Ticket');
  return ticket;
};

export const createTicket = async (data, createdById) => {
  return ticketRepo.createTicket({ ...data, createdById });
};

export const updateTicket = async (id, data) => {
  const ticket = await ticketRepo.findTicketById(id);
  if (!ticket) throw new NotFoundError('Ticket');
  // Auto set resolvedAt when status changes to resolved
  if (data.status === 'resolved' && ticket.status !== 'resolved') {
    data.resolvedAt = new Date();
  }
  return ticketRepo.updateTicket(id, data);
};

export const deleteTicket = async (id) => {
  const ticket = await ticketRepo.findTicketById(id);
  if (!ticket) throw new NotFoundError('Ticket');
  await ticketRepo.deleteTicket(id);
};