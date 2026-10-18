import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminUsers } from './AdminUsers';
import { adminApi } from '../api/api';

vi.mock('../api/api', () => ({
  adminApi: {
    getUsers: vi.fn(),
    updateUserRole: vi.fn(), // 👈 Nome correto que o componente usa
  },
}));

// O componente espera `id` como string e `role` como string
const fakeUsers = [
  { id: '1', name: 'Ana',  email: 'ana@x.com',  role: 'CUSTOMER' },
  { id: '2', name: 'Beto', email: 'beto@x.com', role: 'ADMIN'    },
];

describe('AdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminApi.getUsers).mockResolvedValue({ content: fakeUsers } as any);
  });

  it('renderiza a lista de usuários', async () => {
    renderWithProviders(<AdminUsers />);

    expect(await screen.findByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Beto')).toBeInTheDocument();
  });

  it('permite alterar a role de um usuário', async () => {
    // Mock da resposta de update
    vi.mocked(adminApi.updateUserRole).mockResolvedValueOnce({ ...fakeUsers[0], role: 'ADMIN' } as any);

    const user = userEvent.setup();
    renderWithProviders(<AdminUsers />);

    const select = await screen.findByRole('combobox', { name: /role do usuário ana/i });
    await user.selectOptions(select, 'ADMIN');

    // O componente envia o `id` como string ('1'), não como number (1)
    expect(adminApi.updateUserRole).toHaveBeenCalledWith('1', 'ADMIN');
  });
});