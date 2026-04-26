import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';
import { Compass, Home, MapPin, Search, User } from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-amber-500">Loading Buzzly...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="flex w-full max-w-[1280px]">
        
        {/* Left Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="fixed w-64 h-screen pb-4">
            <LeftSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-2xl w-full mx-auto pb-20 md:pb-0 px-4 pt-4 md:pt-6 border-x border-white/5 min-h-screen relative">
          <Outlet />
        </main>

        {/* Right Sidebar - Hidden on smaller screens */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="fixed w-80 h-screen p-4 overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0600]/95 backdrop-blur-md border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
          <Home size={22} />
          <span className="text-[10px] font-semibold">Feed</span>
        </NavLink>
        
        <NavLink to="/explore" className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
          <Search size={22} />
          <span className="text-[10px] font-semibold">Explore</span>
        </NavLink>

        <NavLink to="/create" className="bg-gradient-to-br from-amber-400 to-amber-hot text-[#0a0600] w-12 h-12 rounded-full flex items-center justify-center -translate-y-4 shadow-amber-lg">
          <span className="text-2xl font-light">+</span>
        </NavLink>

        <NavLink to="/messages" className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-amber-400' : 'text-gray-400'} relative`}>
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0a0600]"></div>
          <Compass size={22} />
          <span className="text-[10px] font-semibold">Chat</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 p-2 ${isActive ? 'text-amber-400' : 'text-gray-400'}`}>
          <User size={22} />
          <span className="text-[10px] font-semibold">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
