import React from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, Calendar, MessageCircle, User, Bell } from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import { LocationPrompt } from '../components/LocationPrompt';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0600] text-amber-500 gap-4">
        <span className="text-5xl animate-bounce">🍺</span>
        <span className="font-bold tracking-widest text-sm uppercase">Buzzly</span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex justify-center min-h-screen bg-[#0a0600]">
      <LocationPrompt />
      <div className="flex w-full max-w-[1440px]">

        {/* Left Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-2xl w-full mx-auto px-4 pt-4 md:pt-6 pb-20 md:pb-8 border-x border-white/5 min-h-screen">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-0 h-screen overflow-y-auto p-4 scrollbar-hide">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0600]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around px-2">
        {[
          { to: '/', icon: Home, label: 'Feed', end: true },
          { to: '/search', icon: Search, label: 'Search' },
          { to: '/events', icon: Calendar, label: 'Events' },
          { to: '/messages', icon: MessageCircle, label: 'Messages' },
          { to: '/notifications', icon: Bell, label: 'Alerts' },
          { to: '/profile', icon: User, label: 'Profile' },
        ].map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 p-2 ${isActive ? 'text-amber-400' : 'text-gray-500'}`}>
            <Icon size={20} />
            <span className="text-[9px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
