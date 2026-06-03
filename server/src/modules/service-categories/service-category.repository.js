import prisma from '../../config/db.js';

const categorySelect = {
  id:          true,
  name:        true,
  slug:        true,
  description: true,
  icon:        true,
  isActive:    true,
  order:       true,
  createdAt:   true,
  updatedAt:   true,
  _count: { select: { services: true } },
};

export const findCategories = (where = {}) =>
  prisma.serviceCategory.findMany({
    where,
    select: categorySelect,
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  });

export const findCategoryById = (id) =>
  prisma.serviceCategory.findUnique({ where: { id }, select: categorySelect });

export const findCategoryBySlug = (slug) =>
  prisma.serviceCategory.findUnique({ where: { slug } });

export const findCategoryByName = (name) =>
  prisma.serviceCategory.findUnique({ where: { name } });

export const createCategory = (data) =>
  prisma.serviceCategory.create({ data, select: categorySelect });

export const updateCategory = (id, data) =>
  prisma.serviceCategory.update({ where: { id }, data, select: categorySelect });

export const deleteCategory = (id) =>
  prisma.serviceCategory.delete({ where: { id } });