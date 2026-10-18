import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/shared/lib/test-utils';
import { AdminUsers } from './AdminUsers';
import { adminApi } from '../api/api';

vi.mock('../api/api', () => ({
  adminApi: { getUsers: vi.fn(), updateUserRole: vi.fn() },
}));

const fakeUsers = [
  { id: '1', name: 'Cliente Comum', email: 'cli@test.com', role: 'CUSTOMER' },
  { id: '2', name: 'Admin Master', email: 'adm@test.com', role: 'ADMIN' },
];

describe('AdminUsers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renderiza a lista de usuários', async () => {
    vi.mocked(adminApi.getUsers).mockResolvedValueOnce({ content: fakeUsers } as any);
    
    renderWithProviders(<AdminUsers />);

    expect(await screen.findByText('Cliente Comum')).toBeInTheDocument();
    expect(screen.getByText('Admin Master')).toBeInTheDocument();
    expect(screen.getByText('cli@test.com')).toBeInTheDocument();
  });

  it('permite alterar a role de um usuário', async () => {
    vi.mocked(adminApi.getUsers).mockResolvedValueOnce({ content: fakeUsers } as any);
    vi.mocked(adminApi.updateUserRole).mockResolvedValueOnce({ ...fakeUsers[0], role: 'ADMIN' } as any);

    const user = userEvent.setup();
    renderWithProviders(<AdminUsers />);

    const select = await screen.findByRole('combobox', { name: /role do usuário 1/i });
    await user.selectOptions(select, 'ADMIN');

    await waitFor(() => {
      expect(adminApi.updateUserRole).toHaveBeenCalledWith('1', 'ADMIN');
    });
  });
});