import api from './api';

export const searchService = {
  search: async (q: string, type: string = 'all'): Promise<{ users: any[]; posts: any[]; total: number }> => {
    const res = await api.get(`/search?q=${encodeURIComponent(q)}&type=${type}`);
    return res.data.data;
  },
};
