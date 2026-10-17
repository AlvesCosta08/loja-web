import { create } from 'zustand';
import type { UserResponse } from '@/shared/types/api';

const TOKEN_KEY = 'loja_token';

interface AuthState {
  token: string | null;
  user: UserResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (token: string, user: UserResponse) => void;
  setUser: (user: UserResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  user: null,
  isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
  isAdmin: false,

  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    set({ token, user, isAuthenticated: true, isAdmin: user.role === 'ADMIN' });
  },

  setUser: (user) => {
    set({ user, isAdmin: user.role === 'ADMIN' });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isAuthenticated: false, isAdmin: false });
  },
}));