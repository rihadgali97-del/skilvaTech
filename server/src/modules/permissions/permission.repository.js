// permissions/permission.repository.js
import prisma from '../../config/db.js';

export const findAllPermissions = () =>
  prisma.permission.findMany({
    orderBy: [{ resource: 'asc' }, { action: 'asc' }],
  });

export const findPermissionsByResource = (resource) =>
  prisma.permission.findMany({ where: { resource } });