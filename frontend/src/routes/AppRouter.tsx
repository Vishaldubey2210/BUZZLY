import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { ToastProvider } from '../context/ToastContext';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import PublicProfile from '../pages/PublicProfile';
import Explore from '../pages/Explore';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';
import Events from '../pages/Events';
import Leaderboard from '../pages/Leaderboard';
import NearbyMap from '../pages/NearbyMap';
import SearchPage from '../pages/SearchPage';
import VenuesPage from '../pages/VenuesPage';
import Settings from '../pages/Settings';
import { Mentors } from '../pages/Mentors';
import { VirtualParty } from '../pages/VirtualParty';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:userId" element={<PublicProfile />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/venues" element={<VenuesPage />} />
                <Route path="/events" element={<Events />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/party" element={<VirtualParty />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/map" element={<NearbyMap />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
