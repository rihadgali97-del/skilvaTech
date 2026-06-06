import prisma from '../../config/db.js';

const leadSelect = {
  id: true, name: true, email: true, phone: true,
  company: true, source: true, status: true,
  notes: true, value: true, createdAt: true, updatedAt: true,
  client:     { select: { id: true, name: true } },
  assignedTo: { select: { id: true, firstName: true, lastName: true } },
};

export const findLeads = ({ skip, take, where, orderBy }) =>
  prisma.lead.findMany({ skip, take, where, orderBy, select: leadSelect });

export const countLeads = (where) => prisma.lead.count({ where });

export const findLeadById = (id) =>
  prisma.lead.findUnique({ where: { id }, select: leadSelect });

export const createLead = (data) =>
  prisma.lead.create({ data, select: leadSelect });

export const updateLead = (id, data) =>
  prisma.lead.update({ where: { id }, data, select: leadSelect });

export const deleteLead = (id) =>
  prisma.lead.delete({ where: { id } });