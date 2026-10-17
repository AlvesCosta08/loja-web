import { api } from '@/shared/lib/axios';
import type { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '@/shared/types/api';

export const cartApi = {
  getCart: () => api.get<CartResponse>('/cart').then((r) => r.data),
  
  addItem: (body: AddToCartRequest) => 
    api.post<void>('/cart/items', body).then((r) => r.data),
    
  updateItem: (itemId: number, body: UpdateCartItemRequest) =>
    api.put<void>(`/cart/items/${itemId}`, body).then((r) => r.data),
    
  removeItem: (itemId: number) =>
    api.delete<void>(`/cart/items/${itemId}`).then((r) => r.data),
    
  clearCart: () =>
    api.delete<void>('/cart').then((r) => r.data),
};