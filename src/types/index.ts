export type UserType = 'individual' | 'company' | 'corporate' | 'vendor';

export type VendorCategory = 
  | 'catering'
  | 'photography'
  | 'videography'
  | 'venue'
  | 'decoration'
  | 'music'
  | 'florist'
  | 'lighting'
  | 'transportation'
  | 'planning';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  verified: boolean;
  responseTime: string;
  services: string[];
  phone: string;
  email: string;
  ownerId?: string;
}

export interface Review {
  id: string;
  vendorId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Message {
  id: string;
  vendorId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  vendorId: string;
  type: 'message' | 'like' | 'booking' | 'review';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface VendorService {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
  image?: string;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  userType: UserType;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  accessToken: string;
  user: User;
}
