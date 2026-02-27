import { useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import NotificationItem from '../components/common/NotificationItem';

const Notifications = () => {
  const { user, logout } = useAuth();
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleNotificationClick = (notificationId, isRead) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this notification?')) {
      await deleteNotification(notificationId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={logout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your job search activity</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Filter Tabs */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Unread ({notifications.filter((n) => !n.read).length})
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'read'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Read ({notifications.filter((n) => n.read).length})
                </button>
              </div>

              {/* Mark All as Read Button */}
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-2">
                  {filter === 'all'
                    ? 'No notifications yet'
                    : filter === 'unread'
                    ? 'No unread notifications'
                    : 'No read notifications'}
                </p>
                <p className="text-sm text-gray-500">
                  {filter === 'all'
                    ? "You'll receive notifications about your applications and job matches"
                    : ''}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div key={notification._id} className="relative group">
                    <NotificationItem
                      notification={notification}
                      onClick={() =>
                        handleNotificationClick(notification._id, notification.read)
                      }
                    />
                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDelete(e, notification._id)}
                      className="absolute top-3 right-3 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Notifications;
