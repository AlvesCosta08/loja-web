export type Role = 'USER' | 'ADMIN';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest { email: string; password: string; }
export interface UserCreateRequest { name: string; email: string; password: string; }
export interface TokenResponse { access_token: string; }

// ─── Produtos e Paginação ──────────────────────────────────────
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
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
export interface AddToCartRequest { productId: number; quantity: number; }
export interface UpdateCartItemRequest { quantity: number; }

// ─── Frete (Shipping) ──────────────────────────────────────────
export interface ShippingQuoteRequest { cep: string; subtotal: number; }

// Campos tornados opcionais para evitar erros se o backend usar nomes diferentes
export interface ShippingOption {
  type: string;
  name?: string;
  cost?: number;
  price?: number;
  value?: number;
  deliveryDays?: number;
  estimatedDays?: number;
}

export interface ShippingQuoteResponse {
  options: ShippingOption[];
}

// ─── Pedidos (Orders) ──────────────────────────────────────────
export interface OrderResponse {
  id: number;
  userId: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELED';
  total: number;
  discount: number;
  shippingCost: number;
  couponCode: string | null;
  createdAt: string;
  items: {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}