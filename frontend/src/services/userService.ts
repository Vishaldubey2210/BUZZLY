import api from './api';
import { User, PaginatedResponse } from '../types';

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  updateProfile: async (data: any): Promise<User> => {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data.data;
  },

  getSuggestions: async (): Promise<User[]> => {
    const response = await api.get('/users/suggestions');
    return response.data.data;
  }
};
