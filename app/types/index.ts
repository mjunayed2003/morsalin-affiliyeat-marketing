export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
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
}

export type ViewMode = 'store' | 'admin' | 'client';
