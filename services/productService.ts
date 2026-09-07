import { http } from './http';
import type { Product, Category } from '@/types';

export interface GetProductsParams {
  featured?: boolean;
  category?: string;
  search?: string;
  fabric?: string;
  sort?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
}

export const productService = {
  getAll: (params?: GetProductsParams) => {
    const query = new URLSearchParams();
    if (params?.featured) query.set('featured', 'true');
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.fabric) query.set('fabric', params.fabric);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());

    const queryString = query.toString();
    const url = `/api/products${queryString ? `?${queryString}` : ''}`;
    return http.get<{ products: Product[]; pagination: PaginationInfo }>(url, { skipAuth: true });
  },

  getBySlug: (slug: string) =>
    http.get<{ product: Product }>(`/api/products/${slug}`, { skipAuth: true }),

  getCategories: () =>
    http.get<{ categories: Category[] }>('/api/categories', { skipAuth: true }),
};
