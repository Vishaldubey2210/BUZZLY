export interface User {
  _id: string;
  email: string;
  buzzName: string;
  handle: string;
  avatar: string;
  bio?: string;
  city?: string;
  level: number;
  xp: number;
  drinkPreferences?: string[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  drinkCategory?: string;
  vibeTag?: string;
  likes: string[];
  commentCount: number;
  author: {
    _id: string;
    buzzName: string;
    handle: string;
    avatar: string;
    level: number;
  };
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  post: string;
  author: {
    _id: string;
    buzzName: string;
    handle: string;
    avatar: string;
  };
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  text: string;
  sender: {
    _id: string;
    buzzName: string;
    avatar: string;
  };
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
    buzzName: string;
    handle: string;
    avatar: string;
  }[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  type: string;
  content: string;
  isRead: boolean;
  sender?: {
    _id: string;
    buzzName: string;
    avatar: string;
  };
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
