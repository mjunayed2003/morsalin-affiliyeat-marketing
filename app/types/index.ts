export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  commission: string;
  commissionAmount: number;
  image: string;
  gallery?: string[];
  affiliateCode: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  badge?: string;
  inStock: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  image?: string;
  productId?: string;
  productInfo?: {
    title: string;
    price: number;
    image: string;
  };
  timestamp: string;
  read: boolean;
  senderName?: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  password?: string;
  email?: string;
  address?: string;
  city?: string;
  avatar?: string;
  verified: boolean;
  verifiedAt: string;
  createdAt: string;
  role: 'client' | 'admin';
}

export type ViewMode = 'store' | 'admin' | 'client';

export const maskPhone = (phone?: string): string => {
  if (!phone) return '0171****678';
  const clean = phone.trim();
  if (clean.includes('*')) return clean;
  if (clean.length <= 6) return clean.slice(0, 2) + '****' + clean.slice(-2);
  return `${clean.slice(0, 4)}****${clean.slice(-3)}`;
};
