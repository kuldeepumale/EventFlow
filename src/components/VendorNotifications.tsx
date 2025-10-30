import { Notification } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MessageSquare, Heart, Calendar, Star, CheckCheck } from 'lucide-react';

interface VendorNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function VendorNotifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: VendorNotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'like':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50';
      case 'like':
        return 'bg-red-50';
      case 'booking':
        return 'bg-green-50';
      case 'review':
        return 'bg-yellow-50';
      default:
        return 'bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Notifications</h2>
          <p className="text-sm text-gray-600">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-l-purple-600' : ''
              }`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${!notification.read ? '' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <Badge variant="secondary" className="shrink-0 text-xs px-2">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p>No notifications yet</p>
            <p className="text-sm mt-2">We'll notify you when something happens</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {notifications.some(n => n.type === 'message' && !n.read) && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <p className="text-sm mb-3">
            💬 You have unread messages from potential clients
          </p>
          <Button size="sm" className="w-full">
            Respond to Messages
          </Button>
        </Card>
      )}
    </div>
  );
}
