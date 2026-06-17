import axios from 'axios';
import type { PostListResponse, Post, AuthResponse, User, ArchiveEntry } from './types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export const getPosts = (params: Record<string, string | number> = {}) =>
  api.get<PostListResponse>('/posts', { params });
export const getPost = (id: number | string) => api.get<Post>(`/posts/${id}`);
export const getCategories = () => api.get<string[]>('/categories');
export const getArchives = () => api.get<ArchiveEntry[]>('/posts/archives');
export const createPost = (data: Partial<Post>) => api.post<Post>('/posts', data);
export const updatePost = (id: number, data: Partial<Post>) => api.put<Post>(`/posts/${id}`, data);
export const deletePost = (id: number) => api.delete(`/posts/${id}`);

export const login = (data: { username: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);
export const register = (data: { username: string; password: string; nickname?: string }) =>
  api.post<AuthResponse>('/auth/register', data);
export const getMe = () => api.get<{ user: User | null }>('/auth/me');

export default api;
