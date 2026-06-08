import * as notifRepo from './notification.repository.js';
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError.js';
import { parsePagination } from '../../shared/utils/pagination.utils.js';

// ─── List notifications for current user ──────────────────────────────────────
export const listNotifications = async (userId, query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const where = { userId };
  if (query.isRead !== undefined) where.isRead = query.isRead === 'true';

  const [data, total, unreadCount] = await Promise.all([
    notifRepo.findNotifications({ skip, take: limit, where, orderBy: { createdAt: 'desc' } }),
    notifRepo.countNotifications(where),
    notifRepo.countUnread(userId),
  ]);

  return { data, total, page, limit, unreadCount };
};

// ─── Create notification (admin sending to a user) ────────────────────────────
export const createNotification = async (data) => {
  return notifRepo.createNotification(data);
};

// ─── Mark single notification as read ────────────────────────────────────────
export const markAsRead = async (id, userId) => {
  const notif = await notifRepo.findNotificationById(id);
  if (!notif) throw new NotFoundError('Notification');
  if (notif.user.id !== userId) throw new ForbiddenError('Access denied');
  return notifRepo.markAsRead(id);
};

// ─── Mark all as read ─────────────────────────────────────────────────────────
export const markAllAsRead = async (userId) => {
  await notifRepo.markAllAsRead(userId);
};

// ─── Delete notification ──────────────────────────────────────────────────────
export const deleteNotification = async (id, userId) => {
  const notif = await notifRepo.findNotificationById(id);
  if (!notif) throw new NotFoundError('Notification');
  if (notif.user.id !== userId) throw new ForbiddenError('Access denied');
  await notifRepo.deleteNotification(id);
};

// ─── Clear all read notifications ────────────────────────────────────────────
export const clearRead = async (userId) => {
  await notifRepo.deleteAllRead(userId);
};

// ─── Helper: send notification (used by other services) ──────────────────────
export const sendNotification = async ({ userId, title, message, type = 'info', link }) => {
  return notifRepo.createNotification({ userId, title, message, type, link });
};