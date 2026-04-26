import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home, Compass, PlusCircle, MapPin, User,
  Zap, Trophy, Calendar, MessageCircle, Bell, Settings,
  TrendingUp, Hash
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Buzz Feed', exact: true },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/map', icon: MapPin, label: 'Nearby Map' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: User, label: 'My Profile' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

const trendingHashtags = [
  '#CraftBeer', '#WhiskeyWednesday', '#MumbaiNights',
  '#BengaluruBars', '#CocktailDrops', '#TastingNotes',
];

const LeftSidebar: React.FC = () => {
  const { user } = useAuth();
  
  const xpProgress = user ? ((user.xp % 1000) / 1000) * 100 : 0;

  if (!user) return <aside className="left-sidebar"></aside>;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-[#110a02]/95 backdrop-blur-md border-r border-[rgba(251,191,36,0.1)] p-5 flex flex-col gap-2 overflow-y-auto z-[100]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 pb-4 mb-1">
        <span className="text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">🍺</span>
        <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-amber-hot">buzzly</span>
      </div>

      {/* Mini Profile Card */}
      <div className="flex items-center gap-3 bg-amber-400/5 border border-amber-400/10 rounded-xl p-3 mb-1">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.buzzName}
            className="w-11 h-11 rounded-full object-cover border-2 border-background"
          />
          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[#0a0600] text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-background">
            Lv.{user.level}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{user.buzzName}</div>
          <div className="text-xs text-gray-400 truncate">@{user.handle}</div>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-hot rounded-full" style={{ width: `${xpProgress}%` }} />
            </div>
            <span className="text-[10px] text-gray-400">{(user.xp || 0).toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-amber-400/10 text-amber-400 font-semibold' : 'text-gray-400 hover:bg-amber-400/5 hover:text-white'}`}
          >
            <span className="relative flex-shrink-0 flex items-center">
              <Icon size={18} />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="h-[1px] bg-[rgba(251,191,36,0.1)] my-2" />

      {/* Trending */}
      <div className="px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
          <TrendingUp size={14} />
          Trending
        </div>
        <div className="flex flex-wrap gap-1.5">
          {trendingHashtags.map(tag => (
            <span key={tag} className="text-[11px] text-amber-400 bg-amber-400/5 border border-amber-400/10 rounded-full px-2 py-1 cursor-pointer transition-colors hover:bg-amber-400/10">{tag}</span>
          ))}
        </div>
      </div>

      {/* Create Post CTA */}
      <NavLink to="/create" className="flex items-center justify-center gap-2 bg-gradient-to-br from-amber-400 to-amber-hot text-[#0a0600] font-bold text-sm py-3 rounded-lg shadow-amber transition-all hover:-translate-y-0.5 hover:shadow-amber-lg mt-2">
        <PlusCircle size={18} />
        Share a Moment
      </NavLink>

      <div className="mt-auto">
        <NavLink to="/settings" className="flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-gray-400 transition-all hover:bg-white/5 hover:text-white">
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default LeftSidebar;
