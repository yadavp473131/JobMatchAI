import { Link } from 'react-router-dom';
import { Briefcase, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const NotificationItem = ({ notification, onClick }) => {
  const { type, title, message, read, createdAt, link } = notification;

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'application_status':
        return <FileText size={20} className="text-blue-600" />;
      case 'new_application':
        return <Briefcase size={20} className="text-green-600" />;
      case 'job_match':
        return <CheckCircle size={20} className="text-purple-600" />;
      case 'application_rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const content = (
    <div
      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        !read ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
            {title}
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{formatTime(createdAt)}</p>
        </div>

        {/* Unread indicator */}
        {!read && (
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );

  // If notification has a link, wrap in Link component
  if (link) {
    return (
      <Link to={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default NotificationItem;
