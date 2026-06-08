import prisma from '../../config/db.js';

const notificationSelect = {
  id: true, title: true, message: true,
  type: true, isRead: true, link: true,
  createdAt: true, updatedAt: true,
  user: { select: { id: true, firstName: true, lastName: true } },
};

export const findNotifications = ({ skip, take, where, orderBy }) =>
  prisma.notification.findMany({ skip, take, where, orderBy, select: notificationSelect });

export const countNotifications = (where) =>
  prisma.notification.count({ where });

export const findNotificationById = (id) =>
  prisma.notification.findUnique({ where: { id }, select: notificationSelect });

export const createNotification = (data) =>
  prisma.notification.create({ data, select: notificationSelect });

export const markAsRead = (id) =>
  prisma.notification.update({ where: { id }, data: { isRead: true }, select: notificationSelect });

export const markAllAsRead = (userId) =>
  prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });

export const deleteNotification = (id) =>
  prisma.notification.delete({ where: { id } });

export const deleteAllRead = (userId) =>
  prisma.notification.deleteMany({ where: { userId, isRead: true } });

export const countUnread = (userId) =>
  prisma.notification.count({ where: { userId, isRead: false } });