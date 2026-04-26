import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { notificationService } from '../services/notificationService';
import { formatTimeAgo } from '../utils/format';
import { Heart, MessageCircle, UserPlus, Info, Check, Loader2 } from 'lucide-react';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      case 'like': return <Heart className="text-red-500 fill-red-500" size={16} />;
      case 'comment': return <MessageCircle className="text-blue-500" size={16} />;
      case 'connection_request': return <UserPlus className="text-amber-500" size={16} />;
      case 'connection_accepted': return <Check className="text-green-500" size={16} />;
      default: return <Info className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="card p-4 md:p-6 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-xs text-amber-500 hover:text-amber-400 font-medium"
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
        <div className="text-center py-12 text-gray-500 text-sm">
          No buzz here yet. Go interact with some posts! 🍻
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map(notif => (
            <div 
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border ${notif.isRead ? 'bg-transparent border-transparent' : 'bg-amber-500/5 border-amber-500/20'}`}
            >
              <div className="relative">
                {notif.sender ? (
                  <img src={notif.sender.avatar} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
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
                <div className="text-xs text-amber-500/60 mt-1">
                  {formatTimeAgo(notif.createdAt)}
                </div>
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
