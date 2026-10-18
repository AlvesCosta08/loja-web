import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AdminRoute } from './AdminRoute';
import { useAuthStore } from '../store';

// Mockamos a store do Zustand para controlar o estado
vi.mock('../store', () => ({
  useAuthStore: vi.fn(),
}));

function renderWithRouter(ui: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={ui} />
        <Route path="/" element={<div>Home Pública</div>} />
        <Route path="/login" element={<div>Tela de Login</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para /login se não estiver autenticado', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    } as any);

    renderWithRouter(
      <AdminRoute>
        <div>Painel Admin</div>
      </AdminRoute>
    );

    expect(screen.getByText('Tela de Login')).toBeInTheDocument();
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument();
  });

  it('redireciona para / (home) se estiver autenticado mas não for ADMIN', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isAdmin: false, // CUSTOMER
    } as any);

    renderWithRouter(
      <AdminRoute>
        <div>Painel Admin</div>
      </AdminRoute>
    );

    expect(screen.getByText('Home Pública')).toBeInTheDocument();
    expect(screen.queryByText('Painel Admin')).not.toBeInTheDocument();
  });

  it('renderiza o conteúdo se for ADMIN', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      isAdmin: true, // ADMIN
    } as any);

    renderWithRouter(
      <AdminRoute>
        <div>Painel Admin</div>
      </AdminRoute>
    );

    expect(screen.getByText('Painel Admin')).toBeInTheDocument();
    expect(screen.queryByText('Home Pública')).not.toBeInTheDocument();
  });
});