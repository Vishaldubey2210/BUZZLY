import api from './api';
import { User, DrinkJourneyEntry } from '../types';

export const userService = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  getSuggestions: async (): Promise<User[]> => {
    const response = await api.get('/users/suggestions');
    return response.data.data;
  },

  getLeaderboard: async (): Promise<User[]> => {
    const response = await api.get('/users/leaderboard');
    return response.data.data;
  },

  getUserStats: async (userId: string): Promise<{ postCount: number; connectionCount: number; followerCount: number; followingCount: number }> => {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data.data;
  },

  followUser: async (userId: string): Promise<{ following: boolean; followerCount: number; followingCount: number }> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data.data;
  },

  getFollowers: async (userId: string): Promise<User[]> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data.data;
  },

  getFollowing: async (userId: string): Promise<User[]> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data.data;
  },

  // Drink Journey
  addDrinkJourneyEntry: async (entry: DrinkJourneyEntry): Promise<DrinkJourneyEntry[]> => {
    const response = await api.post('/users/me/drink-journey', entry);
    return response.data.data;
  },

  updateDrinkJourneyEntry: async (entryId: string, entry: DrinkJourneyEntry): Promise<DrinkJourneyEntry[]> => {
    const response = await api.put(`/users/me/drink-journey/${entryId}`, entry);
    return response.data.data;
  },

  deleteDrinkJourneyEntry: async (entryId: string): Promise<void> => {
    await api.delete(`/users/me/drink-journey/${entryId}`);
  },
};
