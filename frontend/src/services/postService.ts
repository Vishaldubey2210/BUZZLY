import api from './api';
import { Post, Comment, PaginatedResponse } from '../types';

export const postService = {
  getFeed: async (page = 1, limit = 10, category = 'all', feedType = 'recent'): Promise<PaginatedResponse<Post>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), feedType });
    if (category && category !== 'all') params.append('category', category);
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  getUserPosts: async (userId: string, page = 1, limit = 20): Promise<PaginatedResponse<Post>> => {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await api.get(`/posts/${postId}`);
    return response.data.data;
  },

  getSavedPosts: async (): Promise<PaginatedResponse<Post>> => {
    const response = await api.get('/posts/saved');
    return response.data;
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

  savePost: async (postId: string): Promise<{ saved: boolean; saveCount: number }> => {
    const response = await api.post(`/posts/${postId}/save`);
    return response.data.data;
  },

  repost: async (postId: string, comment?: string): Promise<Post> => {
    const response = await api.post(`/posts/${postId}/repost`, { comment });
    return response.data.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  },

  updatePost: async (postId: string, data: any): Promise<Post> => {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data.data;
  },

  reportPost: async (postId: string, reason: string): Promise<void> => {
    await api.post(`/posts/${postId}/report`, { reason });
  },

  getComments: async (postId: string, page = 1): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}`);
    return response.data;
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data.data;
  },
};
