export interface Post {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  author: string;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  content: Post[];
  page: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
}

export interface User {
  id: number;
  username: string;
  nickname: string;
  avatar: string | null;
  bio: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ArchiveEntry {
  year: number;
  month: number;
  count: number;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: { username: string; password: string }) => Promise<AuthResponse>;
  register: (data: { username: string; password: string; nickname?: string }) => Promise<AuthResponse>;
  logout: () => void;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
