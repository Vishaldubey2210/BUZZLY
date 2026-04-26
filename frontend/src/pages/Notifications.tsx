import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '../utils/format';
import { Heart, MessageCircle, UserPlus, Info, Check, Loader2, Bell } from 'lucide-react';

const Notifications: React.FC = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Real-time socket notifications
  useEffect(() => {
    if (!socket) return;
    const handleNew = (notif: Notification) => {
      setNotifications(prev => [notif, ...prev]);
    };
    socket.on('new_notification', handleNew);
    return () => { socket.off('new_notification', handleNew); };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="text-red-400 fill-red-400" size={15} />;
      case 'comment': return <MessageCircle className="text-blue-400" size={15} />;
      case 'connection_request': return <UserPlus className="text-amber-500" size={15} />;
      case 'connection_accepted': return <Check className="text-green-400" size={15} />;
      default: return <Info className="text-gray-400" size={15} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="card p-4 md:p-6 min-h-[80vh] animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-amber-500" />
          <h1 className="text-xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-5xl mb-4 opacity-30">🔔</div>
          <p className="text-gray-400 font-medium">No notifications yet</p>
          <p className="text-gray-600 text-sm mt-1">Go interact with some posts! 🍻</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {notifications.map(notif => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border
                ${notif.isRead
                  ? 'bg-transparent border-transparent hover:bg-white/3'
                  : 'bg-amber-500/5 border-amber-500/15 hover:bg-amber-500/8'}`}
            >
              <div className="relative flex-shrink-0">
                {notif.sender ? (
                  <img src={notif.sender.avatar} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    {getIcon(notif.type)}
                  </div>
                )}
                {notif.sender && (
                  <div className="absolute -bottom-1 -right-1 bg-[#110a02] rounded-full p-1 border border-white/10 shadow-sm">
                    {getIcon(notif.type)}
                  </div>
                )}
              </div>

              <div className="flex-1 mt-1">
                <p className="text-sm">
                  {notif.sender && <span className="font-bold text-white mr-1">{notif.sender.buzzName}</span>}
                  <span className={notif.isRead ? 'text-gray-400' : 'text-gray-200'}>{notif.content}</span>
                </p>
                <div className="text-xs text-amber-500/60 mt-1">{formatTimeAgo(notif.createdAt)}</div>
              </div>

              {!notif.isRead && (
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full mt-2 shrink-0 shadow-[0_0_8px_theme(colors.amber.500)]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
