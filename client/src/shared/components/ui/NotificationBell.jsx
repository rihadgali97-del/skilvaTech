import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from "../../../modules/notifications/hooks/useNotifications";
const typeColors = {
  info:    'bg-blue-100 text-blue-600',
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error:   'bg-red-100 text-red-600',
};

const typeIcons = { info: 'ℹ', success: '✓', warning: '⚠', error: '✕' };

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  const {
    notifications, unreadCount, loading,
    markAsRead, markAllRead, deleteNotification, clearRead,
  } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkRead = async (notif) => {
    if (!notif.isRead) await markAsRead(notif.id);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00d4d4] text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="text-xs text-[#00b3b3] hover:text-[#008080] font-medium transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={clearRead}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Clear read
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 flex justify-center">
                <div className="w-5 h-5 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif)}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors
                    ${notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-[#00d4d4]/5 hover:bg-[#00d4d4]/10'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${typeColors[notif.type]}`}>
                    {typeIcons[notif.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#00d4d4] flex-shrink-0 mt-1.5" />
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                    className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;