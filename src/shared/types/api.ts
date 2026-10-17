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