import prisma from '../../config/db.js';

// ─── Base select (never expose password) ─────────────────────────────────────
const userSelect = {
  id:             true,
  email:          true,
  firstName:      true,
  lastName:       true,
  avatar:         true,
  phone:          true,
  isActive:       true,
  isEmailVerified: true,
  lastLoginAt:    true,
  createdAt:      true,
  updatedAt:      true,
  role: {
    select: {
      id:   true,
      name: true,
    },
  },
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const findUsers = ({ skip, take, where, orderBy }) =>
  prisma.user.findMany({ skip, take, where, orderBy, select: userSelect });

export const countUsers = (where) =>
  prisma.user.count({ where });

export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id }, select: userSelect });

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });

export const createUser = (data) =>
  prisma.user.create({ data, select: userSelect });

export const updateUser = (id, data) =>
  prisma.user.update({ where: { id }, data, select: userSelect });

export const deleteUser = (id) =>
  prisma.user.delete({ where: { id } });

export const setUserActive = (id, isActive) =>
  prisma.user.update({ where: { id }, data: { isActive }, select: userSelect });