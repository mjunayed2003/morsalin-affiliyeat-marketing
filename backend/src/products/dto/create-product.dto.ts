export class CreateProductDto {
  id?: string;
  title!: string;
  description!: string;
  category!: string;
  subCategory?: string;
  price?: number;
  originalPrice!: number;
  commission?: string;
  commissionAmount?: number;
  image!: string;
  gallery?: string[];
  affiliateCode?: string;
  features?: string[];
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  inStock?: boolean;
  store?: string;
  amazonUrl?: string;
}

export class UpdateProductDto {
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  price?: number;
  originalPrice?: number;
  commission?: string;
  commissionAmount?: number;
  image?: string;
  gallery?: string[];
  affiliateCode?: string;
  features?: string[];
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  inStock?: boolean;
  store?: string;
  amazonUrl?: string;
}
