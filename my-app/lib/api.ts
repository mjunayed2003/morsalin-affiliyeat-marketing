import { Product, User } from '@/app/types';
import { API_BASE_URL } from '@/lib/socket';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          data: null,
          error: errorData.message || `Request failed with status ${response.status}`,
        };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err.message || 'Network error connecting to backend API',
      };
    }
  }

  // ==========================================
  // PRODUCTS API
  // ==========================================
  products = {
    getAll: async (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const qs = params.toString() ? `?${params.toString()}` : '';
      return this.request<Product[]>(`/products${qs}`);
    },

    getById: async (id: string) => {
      return this.request<Product>(`/products/${id}`);
    },

    create: async (payload: Partial<Product>) => {
      return this.request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    update: async (id: string, payload: Partial<Product>) => {
      return this.request<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },

    delete: async (id: string) => {
      return this.request<{ success: boolean }>(`/products/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // ==========================================
  // USERS API
  // ==========================================
  users = {
    getAll: async () => {
      return this.request<User[]>('/users');
    },

    getById: async (id: string) => {
      return this.request<User>(`/users/${id}`);
    },

    block: async (id: string) => {
      return this.request<User>(`/users/${id}/block`, {
        method: 'PATCH',
      });
    },

    unblock: async (id: string) => {
      return this.request<User>(`/users/${id}/unblock`, {
        method: 'PATCH',
      });
    },
  };

  // ==========================================
  // AFFILIATE CLICKS & ANALYTICS
  // ==========================================
  analytics = {
    trackClick: async (productId: string, metadata?: Record<string, any>) => {
      return this.request<{ recorded: boolean }>('/analytics/clicks', {
        method: 'POST',
        body: JSON.stringify({ productId, ...metadata }),
      });
    },

    trackPageView: async (path: string) => {
      return this.request<{ recorded: boolean }>('/analytics/pageviews', {
        method: 'POST',
        body: JSON.stringify({ path, timestamp: new Date().toISOString() }),
      });
    },
  };
}

export const api = new ApiClient(API_BASE_URL);
export default api;
