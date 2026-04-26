import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Feed from '../pages/Feed';
// import Profile from '../pages/Profile';
// import Explore from '../pages/Explore';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';

// Simple placeholder components for now, will replace with real pages next
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-8 text-center text-gray-400">
    <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
    <p>This page is under construction.</p>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Protected App Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Placeholder name="My Profile" />} />
              <Route path="/explore" element={<Placeholder name="Explore" />} />
              <Route path="/events" element={<Placeholder name="Events" />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/leaderboard" element={<Placeholder name="Leaderboard" />} />
              <Route path="/map" element={<Placeholder name="Nearby Map" />} />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
