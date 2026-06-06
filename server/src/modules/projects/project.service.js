// project.service.js
import * as projectRepo from './project.repository.js';
import { NotFoundError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';

export const listProjects = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'name', 'startDate', 'endDate']);
  const where = {};
  if (query.search)    where.name     = { contains: query.search, mode: 'insensitive' };
  if (query.status)    where.status   = query.status;
  if (query.priority)  where.priority = query.priority;
  if (query.clientId)  where.clientId = query.clientId;
  if (query.managerId) where.managerId = query.managerId;

  const [data, total] = await Promise.all([
    projectRepo.findProjects({ skip, take: limit, where, orderBy }),
    projectRepo.countProjects(where),
  ]);
  return { data: data.map(formatProject), total, page, limit };
};

export const getProjectById = async (id) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new NotFoundError('Project');
  return formatProject(project);
};

export const createProject = async (data) => {
  const project = await projectRepo.createProject(data);
  return formatProject(project);
};

export const updateProject = async (id, data) => {
  const existing = await projectRepo.findProjectById(id);
  if (!existing) throw new NotFoundError('Project');
  const project = await projectRepo.updateProject(id, data);
  return formatProject(project);
};

export const deleteProject = async (id) => {
  const project = await projectRepo.findProjectById(id);
  if (!project) throw new NotFoundError('Project');
  await projectRepo.deleteProject(id);
};

const formatProject = (p) => ({
  ...p,
  ticketCount: p._count?.tickets ?? 0,
  _count: undefined,
});