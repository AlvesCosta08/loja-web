import { api } from '@/shared/lib/axios';
import type { ShippingOption, ShippingQuoteRequest } from '@/shared/types/api';

export const shippingApi = {
  quote: (body: ShippingQuoteRequest) =>
    api.post<ShippingOption[]>('/shipping/quote', body).then((r) => r.data),
};