import prisma from '../../config/db.js';

const projectSelect = {
  id: true, name: true, description: true, status: true,
  priority: true, startDate: true, endDate: true, budget: true,
  createdAt: true, updatedAt: true,
  client:  { select: { id: true, name: true, company: true } },
  manager: { select: { id: true, firstName: true, lastName: true } },
  _count:  { select: { tickets: true } },
};

export const findProjects = ({ skip, take, where, orderBy }) =>
  prisma.project.findMany({ skip, take, where, orderBy, select: projectSelect });

export const countProjects = (where) => prisma.project.count({ where });

export const findProjectById = (id) =>
  prisma.project.findUnique({ where: { id }, select: projectSelect });

export const createProject = (data) =>
  prisma.project.create({ data, select: projectSelect });

export const updateProject = (id, data) =>
  prisma.project.update({ where: { id }, data, select: projectSelect });

export const deleteProject = (id) =>
  prisma.project.delete({ where: { id } });