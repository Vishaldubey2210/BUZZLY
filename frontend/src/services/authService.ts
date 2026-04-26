import api from './api';
import { AuthResponse } from '../types';

export const authService = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  signup: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data.data;
  }
};
