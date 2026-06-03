import * as categoryRepo from './service-category.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors/AppError.js';
import { generateSlug } from '../../shared/utils/formatters.js';

export const listCategories = async (query = {}) => {
  const where = {};
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';
  const categories = await categoryRepo.findCategories(where);
  return categories.map(formatCategory);
};

export const getCategoryById = async (id) => {
  const category = await categoryRepo.findCategoryById(id);
  if (!category) throw new NotFoundError('Service category');
  return formatCategory(category);
};

export const createCategory = async (data) => {
  const slug = data.slug || generateSlug(data.name);

  const [nameExists, slugExists] = await Promise.all([
    categoryRepo.findCategoryByName(data.name),
    categoryRepo.findCategoryBySlug(slug),
  ]);

  if (nameExists) throw new ConflictError(`Category "${data.name}" already exists`);
  if (slugExists) throw new ConflictError(`Slug "${slug}" already in use`);

  const category = await categoryRepo.createCategory({ ...data, slug });
  return formatCategory(category);
};

export const updateCategory = async (id, data) => {
  const existing = await categoryRepo.findCategoryById(id);
  if (!existing) throw new NotFoundError('Service category');

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await categoryRepo.findCategoryBySlug(data.slug);
    if (slugExists) throw new ConflictError(`Slug "${data.slug}" already in use`);
  }

  const category = await categoryRepo.updateCategory(id, data);
  return formatCategory(category);
};

export const deleteCategory = async (id) => {
  const category = await categoryRepo.findCategoryById(id);
  if (!category) throw new NotFoundError('Service category');
  if (category._count?.services > 0)
    throw new ForbiddenError(`Cannot delete category with ${category._count.services} services`);
  await categoryRepo.deleteCategory(id);
};

const formatCategory = (cat) => ({
  ...cat,
  serviceCount: cat._count?.services ?? 0,
  _count: undefined,
});