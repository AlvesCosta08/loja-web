export type Role = 'USER' | 'ADMIN';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserCreateRequest {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
}

// ─── Produtos e Paginação ──────────────────────────────────────

export interface ProductResponse {
  id: number;           // bigint no banco
  name: string;
  price: number;
  stock: number;        // coluna 'stock'
  category: string;
  imageUrl?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Carrinho ──────────────────────────────────────────────────

export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  total: number;
  itemCount: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}