import api from './api';
import { Post, Comment, PaginatedResponse } from '../types';

export const postService = {
  getFeed: async (page = 1, limit = 20): Promise<PaginatedResponse<Post>> => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data; // Note: returns the whole wrapper to get meta
  },

  createPost: async (postData: any): Promise<Post> => {
    const response = await api.post('/posts', postData);
    return response.data.data;
  },

  likePost: async (postId: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data.data;
  },

  unlikePost: async (postId: string): Promise<Post> => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data.data;
  },

  getComments: async (postId: string, page = 1): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}`);
    return response.data;
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data.data;
  }
};
