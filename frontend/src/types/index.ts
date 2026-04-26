export interface User {
  _id: string;
  email: string;
  buzzName: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  headline?: string;
  city?: string;
  website?: string;
  level: number;
  xp: number;
  drinkPreferences?: string[];
  drinkJourney?: DrinkJourneyEntry[];
  badges?: Badge[];
  followers?: string[];
  following?: string[];
  savedPosts?: string[];
  isFollowing?: boolean;
  notificationPrefs?: {
    likes: boolean;
    comments: boolean;
    connections: boolean;
    messages: boolean;
  };
  locationSet?: boolean;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
}

export interface DrinkJourneyEntry {
  _id?: string;
  title: string;
  place: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earnedAt: string;
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
  saves?: string[];
  reposts?: string[];
  commentCount: number;
  repostOf?: Post | null;
  repostComment?: string;
  author: {
    _id: string;
    buzzName: string;
    handle: string;
    avatar: string;
    level: number;
    xp?: number;
    headline?: string;
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
    level?: number;
  };
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  text: string;
  isRead?: boolean;
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
  referenceId?: string;
  sender?: {
    _id: string;
    buzzName: string;
    avatar: string;
  };
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  venue: { name: string; address: string; city: string };
  date: string;
  image?: string;
  category: string;
  attendees: string[];
  isFeatured?: boolean;
  createdBy?: { _id: string; buzzName: string; avatar: string };
  createdAt: string;
}

export interface Venue {
  _id: string;
  name: string;
  type: string;
  description?: string;
  address?: string;
  city: string;
  image?: string;
  coverImage?: string;
  specialties?: string[];
  tags?: string[];
  followers: string[];
  rating?: number;
  priceRange?: string;
  openingHours?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  website?: string;
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
