import { api } from '@/shared/lib/axios';
import type { ProductResponse, PageResponse } from '@/shared/types/api';

export interface ProductListParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
}

// 👇 Interface alinhada EXATAMENTE com o ProductRequest.java do backend
export interface ProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string | null;
}

export const productApi = {
  // 📖 Leitura (Público)
  list: (params: ProductListParams = {}) =>
    api.get<PageResponse<ProductResponse>>('/products', { params }).then((r) => r.data),
    
  getById: (id: number) =>
    api.get<ProductResponse>(`/products/${id}`).then((r) => r.data),

  // ✍️ Escrita (Admin)
  create: (data: ProductRequest) =>
    api.post<ProductResponse>('/products', data).then((r) => r.data),

  update: (id: number, data: ProductRequest) =>
    api.put<ProductResponse>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/products/${id}`).then((r) => r.data),

  // 📤 Upload de imagem
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string }>('/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data);
  },
};