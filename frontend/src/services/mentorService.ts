import api from './api';

export const mentorService = {
  getMentors: async (expertise?: string) => {
    const params = expertise && expertise !== 'all' ? `?expertise=${expertise}` : '';
    const response = await api.get(`/mentors${params}`);
    return response.data.data;
  },

  registerMentor: async (data: any) => {
    const response = await api.post('/mentors/register', data);
    return response.data.data;
  },

  bookSession: async (mentorProfileId: string, scheduledAt: string, notes: string) => {
    const response = await api.post('/mentors/sessions/book', { mentorProfileId, scheduledAt, notes });
    return response.data.data;
  },

  getMySessions: async () => {
    const response = await api.get('/mentors/sessions/me');
    return response.data.data;
  }
};
