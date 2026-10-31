import { Product } from '../types';

/**
 * Clean catalog defaults: All product data is dynamically synchronized directly
 * from the PostgreSQL database via NestJS backend API (/api/products).
 * No hardcoded demo or dummy data.
 */
export const INITIAL_PRODUCTS: Product[] = [];
