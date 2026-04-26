import api from './api';

export const venueService = {
  getVenues: async (page = 1, limit = 20, city?: string, type?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (city) params.append('city', city);
    if (type) params.append('type', type);
    const res = await api.get(`/venues?${params}`);
    return res.data;
  },
  getVenueById: async (id: string) => {
    const res = await api.get(`/venues/${id}`);
    return res.data.data;
  },
  followVenue: async (id: string) => {
    const res = await api.post(`/venues/${id}/follow`);
    return res.data.data;
  },
};
