import { api } from '@/shared/lib/axios';
import type { ShippingQuoteRequest, ShippingQuoteResponse } from '@/shared/types/api';

export const shippingApi = {
  quote: (body: ShippingQuoteRequest) =>
    api.post<ShippingQuoteResponse>('/shipping/quote', body).then((r) => r.data),
};