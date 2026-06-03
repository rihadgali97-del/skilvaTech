import * as serviceRepo from './service.repository.js';
import { findCategoryById } from '../service-categories/service-category.repository.js';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';
import { generateSlug } from '../../shared/utils/formatters.js';

export const listServices = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'name', 'order', 'price']);

  const where = {};
  if (query.search) {
    where.OR = [
      { name:        { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.categoryId)              where.categoryId  = query.categoryId;
  if (query.isActive !== undefined)  where.isActive    = query.isActive   === 'true';
  if (query.isFeatured !== undefined) where.isFeatured = query.isFeatured === 'true';

  const [data, total] = await Promise.all([
    serviceRepo.findServices({ skip, take: limit, where, orderBy }),
    serviceRepo.countServices(where),
  ]);

  return { data, total, page, limit };
};

export const getServiceById = async (id) => {
  const service = await serviceRepo.findServiceById(id);
  if (!service) throw new NotFoundError('Service');
  return service;
};

export const createService = async (data) => {
  const slug = data.slug || generateSlug(data.name);
  const category = await findCategoryById(data.categoryId);
  if (!category) throw new NotFoundError('Service category');
  const slugExists = await serviceRepo.findServiceBySlug(slug);
  if (slugExists) throw new ConflictError(`Slug "${slug}" already in use`);
  return serviceRepo.createService({ ...data, slug });
};

export const updateService = async (id, data) => {
  const existing = await serviceRepo.findServiceById(id);
  if (!existing) throw new NotFoundError('Service');
  if (data.categoryId && data.categoryId !== existing.category?.id) {
    const category = await findCategoryById(data.categoryId);
    if (!category) throw new NotFoundError('Service category');
  }
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await serviceRepo.findServiceBySlug(data.slug);
    if (slugExists) throw new ConflictError(`Slug "${data.slug}" already in use`);
  }
  return serviceRepo.updateService(id, data);
};

export const deleteService = async (id) => {
  const service = await serviceRepo.findServiceById(id);
  if (!service) throw new NotFoundError('Service');
  await serviceRepo.deleteService(id);
};