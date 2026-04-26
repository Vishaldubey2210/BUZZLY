import api from './api';
import { Conversation, Message, PaginatedResponse } from '../types';

export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  getMessages: async (conversationId: string, page = 1): Promise<PaginatedResponse<Message>> => {
    const response = await api.get(`/messages/${conversationId}?page=${page}`);
    return response.data;
  },

  sendMessage: async (conversationId: string, text: string): Promise<Message> => {
    const response = await api.post(`/messages/${conversationId}`, { text });
    return response.data.data;
  }
};
