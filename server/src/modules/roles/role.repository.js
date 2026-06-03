import prisma from '../../config/db.js';

const roleSelect = {
  id:          true,
  name:        true,
  description: true,
  isDefault:   true,
  isSystem:    true,
  createdAt:   true,
  updatedAt:   true,
  permissions: {
    select: {
      permission: {
        select: { id: true, name: true, resource: true, action: true },
      },
    },
  },
  _count: { select: { users: true } },
};

export const findRoles = () =>
  prisma.role.findMany({ select: roleSelect, orderBy: { createdAt: 'asc' } });

export const findRoleById = (id) =>
  prisma.role.findUnique({ where: { id }, select: roleSelect });

export const findRoleByName = (name) =>
  prisma.role.findUnique({ where: { name } });

export const createRole = (data) =>
  prisma.role.create({ data, select: roleSelect });

export const updateRole = (id, data) =>
  prisma.role.update({ where: { id }, data, select: roleSelect });

export const deleteRole = (id) =>
  prisma.role.delete({ where: { id } });

// Replace all permissions for a role in one transaction
export const setRolePermissions = async (roleId, permissionIds) => {
  return prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    }),
  ]);
};