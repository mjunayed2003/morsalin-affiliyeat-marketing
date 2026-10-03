export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  commission: string; // e.g. "৳320 (17%)"
  commissionAmount: number;
  image: string;
  gallery?: string[];
  affiliateCode: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  badge?: string; // "Trending", "Hot Deal", "Affiliate Pick", "Best Seller"
  inStock: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  text: string;
  image?: string; // Attached image URL or base64 data
  productId?: string;
  productInfo?: {
    title: string;
    price: number;
    image: string;
  };
  timestamp: string;
  read: boolean;
}

export interface Inquiry {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  customerName: string;
  customerPhone?: string;
  message: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export type ViewMode = 'store' | 'admin';
