import api from './api';
import { Notification, PaginatedResponse } from '../types';

export const notificationService = {
  getNotifications: async (page = 1, limit = 20): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  }
};
