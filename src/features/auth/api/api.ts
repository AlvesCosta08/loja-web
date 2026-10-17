import { api } from '@/shared/lib/axios';
import type { LoginRequest, TokenResponse, UserCreateRequest, UserResponse } from '@/shared/types/api';

export const authApi = {
  login: (body: LoginRequest) => api.post<TokenResponse>('/auth/login', body).then((r) => r.data),
  register: (body: UserCreateRequest) => api.post<UserResponse>('/auth/register', body).then((r) => r.data),
  me: () => api.get<UserResponse>('/users/me').then((r) => r.data),
};