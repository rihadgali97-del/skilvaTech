import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await notificationApi.list({ limit: 20 });
      setNotifications(data.data);
      setUnreadCount(data.unreadCount || 0);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await notificationApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    const notif = notifications.find((n) => n.id === id);
    await notificationApi.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const clearRead = async () => {
    await notificationApi.clearRead();
    setNotifications((prev) => prev.filter((n) => !n.isRead));
  };

  return {
    notifications, unreadCount, loading,
    markAsRead, markAllRead, deleteNotification, clearRead,
    refetch: fetchNotifications,
  };
};