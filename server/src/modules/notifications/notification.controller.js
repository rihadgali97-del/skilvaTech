import * as notifService from './notification.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

// GET /api/v1/notifications
export const listNotifications = async (req, res, next) => {
  try {
    const result = await notifService.listNotifications(req.user.id, req.query);
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
      unreadCount: result.unreadCount,
    });
  } catch (err) { next(err); }
};

// POST /api/v1/notifications (admin only)
export const createNotification = async (req, res, next) => {
  try {
    const notif = await notifService.createNotification(req.body);
    sendCreated(res, { notification: notif }, 'Notification sent');
  } catch (err) { next(err); }
};

// PATCH /api/v1/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id, req.user.id);
    sendSuccess(res, { notification: notif }, 'Marked as read');
  } catch (err) { next(err); }
};

// PATCH /api/v1/notifications/read-all
export const markAllAsRead = async (req, res, next) => {
  try {
    await notifService.markAllAsRead(req.user.id);
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) { next(err); }
};

// DELETE /api/v1/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    await notifService.deleteNotification(req.params.id, req.user.id);
    sendNoContent(res);
  } catch (err) { next(err); }
};

// DELETE /api/v1/notifications/clear-read
export const clearRead = async (req, res, next) => {
  try {
    await notifService.clearRead(req.user.id);
    sendSuccess(res, null, 'Read notifications cleared');
  } catch (err) { next(err); }
};