import api from './api';
import { User } from '../types';

export const connectionService = {
  getConnections: async (): Promise<User[]> => {
    const response = await api.get('/connections');
    return response.data.data;
  },

  getPendingRequests: async (): Promise<any[]> => {
    const response = await api.get('/connections/requests/pending');
    return response.data.data;
  },

  sendRequest: async (userId: string): Promise<any> => {
    const response = await api.post(`/connections/request/${userId}`);
    return response.data.data;
  },

  acceptRequest: async (connectionId: string): Promise<any> => {
    const response = await api.put(`/connections/accept/${connectionId}`);
    return response.data.data;
  },

  rejectRequest: async (connectionId: string): Promise<any> => {
    const response = await api.delete(`/connections/reject/${connectionId}`);
    return response.data.data;
  }
};
