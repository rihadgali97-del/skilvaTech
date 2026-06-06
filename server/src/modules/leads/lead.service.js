// lead.service.js
import * as leadRepo from './lead.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';

export const listLeads = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'name', 'value', 'status']);
  const where = {};
  if (query.search) {
    where.OR = [
      { name:    { contains: query.search, mode: 'insensitive' } },
      { email:   { contains: query.search, mode: 'insensitive' } },
      { company: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.status)       where.status       = query.status;
  if (query.source)       where.source       = query.source;
  if (query.assignedToId) where.assignedToId = query.assignedToId;

  const [data, total] = await Promise.all([
    leadRepo.findLeads({ skip, take: limit, where, orderBy }),
    leadRepo.countLeads(where),
  ]);
  return { data, total, page, limit };
};

export const getLeadById = async (id) => {
  const lead = await leadRepo.findLeadById(id);
  if (!lead) throw new NotFoundError('Lead');
  return lead;
};

export const createLead = async (data) => leadRepo.createLead(data);

export const updateLead = async (id, data) => {
  const lead = await leadRepo.findLeadById(id);
  if (!lead) throw new NotFoundError('Lead');
  return leadRepo.updateLead(id, data);
};

export const deleteLead = async (id) => {
  const lead = await leadRepo.findLeadById(id);
  if (!lead) throw new NotFoundError('Lead');
  await leadRepo.deleteLead(id);
};