import api from './api';

export const eventService = {
  getEvents: async (page = 1, limit = 10, category?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category && category !== 'all') params.append('category', category);
    const response = await api.get(`/events?${params.toString()}`);
    return response.data; // paginated
  },

  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  rsvpEvent: async (id: string) => {
    const response = await api.post(`/events/${id}/rsvp`);
    return response.data.data;
  },

  unrsvpEvent: async (id: string) => {
    const response = await api.delete(`/events/${id}/rsvp`);
    return response.data.data;
  },

  createEvent: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data.data;
  },
};
