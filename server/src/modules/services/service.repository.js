import prisma from '../../config/db.js';

const serviceSelect = {
  id: true, name: true, slug: true, description: true,
  content: true, icon: true, image: true, price: true,
  isActive: true, isFeatured: true, order: true,
  createdAt: true, updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
};

export const findServices = ({ skip, take, where, orderBy }) =>
  prisma.service.findMany({ skip, take, where, orderBy, select: serviceSelect });

export const countServices = (where) =>
  prisma.service.count({ where });

export const findServiceById = (id) =>
  prisma.service.findUnique({ where: { id }, select: serviceSelect });

export const findServiceBySlug = (slug) =>
  prisma.service.findUnique({ where: { slug } });

export const createService = (data) =>
  prisma.service.create({ data, select: serviceSelect });

export const updateService = (id, data) =>
  prisma.service.update({ where: { id }, data, select: serviceSelect });

export const deleteService = (id) =>
  prisma.service.delete({ where: { id } });