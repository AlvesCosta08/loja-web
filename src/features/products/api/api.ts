import { api } from '@/shared/lib/axios';
import type { ProductResponse, PageResponse } from '@/shared/types/api';

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
}

export const productApi = {
  list: (params: ProductListParams = {}) =>
    api.get<PageResponse<ProductResponse>>('/products', { params }).then((r) => r.data),
    
  getById: (id: number) =>
    api.get<ProductResponse>(`/products/${id}`).then((r) => r.data),
};