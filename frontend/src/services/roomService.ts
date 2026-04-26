import api from './api';

export const roomService = {
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data.data;
  },

  createRoom: async (name: string, type: 'public' | 'private' | 'request') => {
    const response = await api.post('/rooms', { name, type });
    return response.data.data;
  },

  joinRoom: async (idOrInvite: string, isInvite = false) => {
    const url = isInvite ? `/rooms/join` : `/rooms/${idOrInvite}/join`;
    const data = isInvite ? { inviteCode: idOrInvite } : {};
    const response = await api.post(url, data);
    return response.data;
  },

  leaveRoom: async (id: string) => {
    const response = await api.post(`/rooms/${id}/leave`);
    return response.data.data;
  }
};
