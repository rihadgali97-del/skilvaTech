import * as clientRepo from './client.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';

export const listClients = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'name', 'company']);
  const where = {};
  if (query.search) {
    where.OR = [
      { name:    { contains: query.search, mode: 'insensitive' } },
      { email:   { contains: query.search, mode: 'insensitive' } },
      { company: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
  const [data, total] = await Promise.all([
    clientRepo.findClients({ skip, take: limit, where, orderBy }),
    clientRepo.countClients(where),
  ]);
  return { data: data.map(formatClient), total, page, limit };
};

export const getClientById = async (id) => {
  const client = await clientRepo.findClientById(id);
  if (!client) throw new NotFoundError('Client');
  return formatClient(client);
};

export const createClient = async (data) => {
  const existing = await clientRepo.findClientByEmail(data.email);
  if (existing) throw new ConflictError('Client with this email already exists');
  const client = await clientRepo.createClient(data);
  return formatClient(client);
};

export const updateClient = async (id, data) => {
  const existing = await clientRepo.findClientById(id);
  if (!existing) throw new NotFoundError('Client');
  if (data.email && data.email !== existing.email) {
    const emailTaken = await clientRepo.findClientByEmail(data.email);
    if (emailTaken) throw new ConflictError('Email already in use');
  }
  const client = await clientRepo.updateClient(id, data);
  return formatClient(client);
};

export const deleteClient = async (id) => {
  const client = await clientRepo.findClientById(id);
  if (!client) throw new NotFoundError('Client');
  if (client._count?.projects > 0)
    throw new ForbiddenError('Cannot delete client with active projects');
  await clientRepo.deleteClient(id);
};

const formatClient = (c) => ({
  ...c,
  projectCount: c._count?.projects ?? 0,
  leadCount:    c._count?.leads    ?? 0,
  invoiceCount: c._count?.invoices ?? 0,
  _count: undefined,
});