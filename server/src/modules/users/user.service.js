import * as userRepo from './user.repository.js';
import { hashPassword } from '../../shared/utils/password.utils.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '../../shared/errors/AppError.js';
import prisma from '../../config/db.js';

// ─── List users ───────────────────────────────────────────────────────────────
export const listUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'firstName', 'lastName', 'email']);

  // Build dynamic where clause
  const where = {};

  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search, mode: 'insensitive' } },
      { lastName:  { contains: query.search, mode: 'insensitive' } },
      { email:     { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.roleId)   where.roleId   = query.roleId;
  if (query.isActive !== undefined) where.isActive = query.isActive === 'true';

  const [data, total] = await Promise.all([
    userRepo.findUsers({ skip, take: limit, where, orderBy }),
    userRepo.countUsers(where),
  ]);

  return { data, total, page, limit };
};

// ─── Get single user ──────────────────────────────────────────────────────────
export const getUserById = async (id) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new NotFoundError('User');
  return user;
};

// ─── Create user (admin creating users, not self-registration) ────────────────
export const createUser = async (data) => {
  // Check email uniqueness
  const existing = await userRepo.findUserByEmail(data.email);
  if (existing) throw new ConflictError('Email already registered');

  // Verify role exists
  const role = await prisma.role.findUnique({ where: { id: data.roleId } });
  if (!role) throw new NotFoundError('Role');

  const hashed = await hashPassword(data.password);
  return userRepo.createUser({ ...data, password: hashed });
};

// ─── Update user profile ──────────────────────────────────────────────────────
export const updateUser = async (id, data) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new NotFoundError('User');
  return userRepo.updateUser(id, data);
};

// ─── Update user role ─────────────────────────────────────────────────────────
export const updateUserRole = async (id, roleId, requestingUser) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new NotFoundError('User');

  // Prevent changing super_admin role unless requester is also super_admin
  if (user.role?.name === 'super_admin' && requestingUser.role?.name !== 'super_admin') {
    throw new ForbiddenError('Cannot modify super admin role');
  }

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new NotFoundError('Role');

  return userRepo.updateUser(id, { roleId });
};

// ─── Activate / deactivate ────────────────────────────────────────────────────
export const setUserActive = async (id, isActive, requestingUser) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new NotFoundError('User');

  // Prevent deactivating yourself
  if (id === requestingUser.id) throw new ForbiddenError('Cannot deactivate your own account');

  // Prevent deactivating super_admin
  if (user.role?.name === 'super_admin') throw new ForbiddenError('Cannot deactivate super admin');

  return userRepo.setUserActive(id, isActive);
};

// ─── Delete user ──────────────────────────────────────────────────────────────
export const deleteUser = async (id, requestingUser) => {
  const user = await userRepo.findUserById(id);
  if (!user) throw new NotFoundError('User');

  if (id === requestingUser.id) throw new ForbiddenError('Cannot delete your own account');
  if (user.role?.name === 'super_admin') throw new ForbiddenError('Cannot delete super admin');

  await userRepo.deleteUser(id);
};