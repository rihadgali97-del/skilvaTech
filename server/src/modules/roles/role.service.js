import * as roleRepo from './role.repository.js';
import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors/AppError.js';
import prisma from '../../config/db.js';

// ─── List all roles ───────────────────────────────────────────────────────────
export const listRoles = async () => {
  const roles = await roleRepo.findRoles();
  // Flatten permissions for easier frontend consumption
  return roles.map(formatRole);
};

// ─── Get single role ──────────────────────────────────────────────────────────
export const getRoleById = async (id) => {
  const role = await roleRepo.findRoleById(id);
  if (!role) throw new NotFoundError('Role');
  return formatRole(role);
};

// ─── Create role ──────────────────────────────────────────────────────────────
export const createRole = async ({ name, description }) => {
  const existing = await roleRepo.findRoleByName(name);
  if (existing) throw new ConflictError(`Role "${name}" already exists`);
  const role = await roleRepo.createRole({ name, description });
  return formatRole(role);
};

// ─── Update role ──────────────────────────────────────────────────────────────
export const updateRole = async (id, data) => {
  const role = await roleRepo.findRoleById(id);
  if (!role) throw new NotFoundError('Role');
  if (role.isSystem) throw new ForbiddenError('System roles cannot be modified');
  const updated = await roleRepo.updateRole(id, data);
  return formatRole(updated);
};

// ─── Delete role ──────────────────────────────────────────────────────────────
export const deleteRole = async (id) => {
  const role = await roleRepo.findRoleById(id);
  if (!role) throw new NotFoundError('Role');
  if (role.isSystem) throw new ForbiddenError('System roles cannot be deleted');
  if (role._count?.users > 0)
    throw new ForbiddenError(`Cannot delete role with ${role._count.users} assigned users`);
  await roleRepo.deleteRole(id);
};

// ─── Assign permissions to role ───────────────────────────────────────────────
export const assignPermissions = async (roleId, permissionIds) => {
  const role = await roleRepo.findRoleById(roleId);
  if (!role) throw new NotFoundError('Role');

  // Verify all permission IDs exist
  const permissions = await prisma.permission.findMany({
    where: { id: { in: permissionIds } },
  });

  if (permissions.length !== permissionIds.length) {
    throw new NotFoundError('One or more permissions not found');
  }

  await roleRepo.setRolePermissions(roleId, permissionIds);
  return getRoleById(roleId);
};

// ─── Helper: flatten permissions ─────────────────────────────────────────────
const formatRole = (role) => ({
  ...role,
  permissions: role.permissions?.map((rp) => rp.permission) ?? [],
  userCount: role._count?.users ?? 0,
  _count: undefined,
});