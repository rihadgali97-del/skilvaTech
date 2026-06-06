import prisma from '../../config/db.js';

const clientSelect = {
  id: true, name: true, email: true, phone: true,
  company: true, address: true, website: true,
  notes: true, isActive: true,
  createdAt: true, updatedAt: true,
  _count: { select: { projects: true, leads: true, invoices: true } },
};

export const findClients = ({ skip, take, where, orderBy }) =>
  prisma.client.findMany({ skip, take, where, orderBy, select: clientSelect });

export const countClients = (where) => prisma.client.count({ where });

export const findClientById = (id) =>
  prisma.client.findUnique({ where: { id }, select: clientSelect });

export const findClientByEmail = (email) =>
  prisma.client.findUnique({ where: { email } });

export const createClient = (data) =>
  prisma.client.create({ data, select: clientSelect });

export const updateClient = (id, data) =>
  prisma.client.update({ where: { id }, data, select: clientSelect });

export const deleteClient = (id) =>
  prisma.client.delete({ where: { id } });