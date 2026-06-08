// audit-log.service.js
import prisma from '../../config/db.js';
import { parsePagination } from '../../shared/utils/pagination.utils.js';

export const log = async ({ userId, action, resource, resourceId, metadata, ipAddress, userAgent }) => {
  return prisma.auditLog.create({
    data: { userId, action, resource, resourceId, metadata, ipAddress, userAgent },
  });
};

export const listAuditLogs = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const where = {};
  if (query.userId)   where.userId   = query.userId;
  if (query.action)   where.action   = { contains: query.action, mode: 'insensitive' };
  if (query.resource) where.resource = query.resource;

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({ skip, take: limit, where, orderBy: { createdAt: 'desc' } }),
    prisma.auditLog.count({ where }),
  ]);

  return { data, total, page, limit };
};