import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './store';

const mockUser = { id: '1', name: 'João', email: 'joao@teste.com', role: 'CUSTOMER' as const };

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  });

  it('deve iniciar deslogado', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it('deve fazer login e salvar o token no localStorage', () => {
    useAuthStore.getState().setAuth('token-falso-123', mockUser);
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('token-falso-123');
    expect(localStorage.getItem('loja_token')).toBe('token-falso-123');
  });

  it('deve fazer logout e limpar o localStorage', () => {
    useAuthStore.getState().setAuth('token-falso-123', mockUser);
    useAuthStore.getState().clearAuth();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(localStorage.getItem('loja_token')).toBeNull();
  });
});