import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { notificationService } from '../services/notificationService';
import {
  Home, Compass, MapPin, User, Trophy, Calendar, MessageCircle,
  Bell, Settings, TrendingUp, Search, Building, PlusCircle, GraduationCap, Music
} from 'lucide-react';

const trendingHashtags = ['#CraftBeer', '#WhiskeyWednesday', '#MumbaiNights', '#BengaluruBars', '#CocktailDrops'];

const LeftSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const xpProgress = user ? ((user.xp % 1000) / 1000) * 100 : 0;

  useEffect(() => {
    if (!user) return;
    notificationService.getNotifications().then((data: any) => {
      const notifs = data.data || [];
      setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
    }).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const handler = () => setUnreadCount(prev => prev + 1);
    socket.on('new_notification', handler);
    return () => { socket.off('new_notification', handler); };
  }, [socket]);

  const navItems = [
    { to: '/', icon: Home, label: 'Buzz Feed', exact: true },
    { to: '/explore', icon: Compass, label: 'Network' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/venues', icon: Building, label: 'Bars & Venues' },
    { to: '/party', icon: Music, label: 'Virtual Party' },
    { to: '/map', icon: MapPin, label: 'Nearby Map' },
    { to: '/mentors', icon: GraduationCap, label: 'Mentors' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount > 0 ? unreadCount : null },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (!user) return <aside className="w-64" />;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-[#110a02]/95 backdrop-blur-md border-r border-[rgba(251,191,36,0.1)] flex flex-col overflow-hidden z-[100]">
      {/* Logo */}
      <div className="flex flex-col px-5 py-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">🍺</span>
          <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500">buzzly</span>
        </div>
        {user?.city && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500/80 mt-1 uppercase tracking-wider pl-8">
            <MapPin size={10} /> {user.city}
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="mx-3 mt-3 mb-1 flex-shrink-0">
        <div
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 bg-amber-400/5 border border-amber-400/10 rounded-xl p-3 cursor-pointer hover:bg-amber-400/8 transition-colors"
        >
          <div className="relative flex-shrink-0">
            <img src={user.avatar} alt={user.buzzName} className="w-11 h-11 rounded-full object-cover border-2 border-[#0a0600]" />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[#0a0600] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-[#110a02]">
              Lv.{user.level}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate text-white">{user.buzzName}</div>
            <div className="text-xs text-gray-400 truncate">@{user.handle}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${xpProgress}%` }} />
              </div>
              <span className="text-[10px] text-gray-400 flex-shrink-0">{(user.xp || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label, badge, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => { if (to === '/notifications') setUnreadCount(0); }}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all mb-0.5
              ${isActive ? 'bg-amber-400/10 text-amber-400 font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
            }
          >
            <span className="relative flex-shrink-0">
              <Icon size={18} />
              {badge && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center border border-[#110a02]">
                  {(badge as number) > 9 ? '9+' : badge}
                </span>
              )}
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Trending + CTA */}
      <div className="px-3 pb-3 flex-shrink-0 border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          <TrendingUp size={12} /> Trending
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {trendingHashtags.map(tag => (
            <span key={tag} onClick={() => navigate(`/search?q=${tag.slice(1)}`)}
              className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-400/10 rounded-full px-2 py-0.5 cursor-pointer hover:bg-amber-400/10 transition-colors">
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm py-2.5 rounded-xl hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(251,191,36,0.25)]"
        >
          <PlusCircle size={16} /> Share a Moment
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;
