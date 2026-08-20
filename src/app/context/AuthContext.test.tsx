import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  apiLogin: vi.fn(),
  apiGetMe: vi.fn()
}));

const TOKEN_KEY = 'huellitas_token';

const fakeUser = { id: 1, name: 'Admin', email: 'admin@huellitas.org', phone: '000', role: 'Superadministrador' as const, isActive: true, createdAt: '' };

describe('AuthContext — manejo del token', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('guarda el token en localStorage al iniciar sesión', async () => {
    vi.mocked(api.apiLogin).mockResolvedValue({ token: 'abc123', user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@huellitas.org', 'secret');
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBe('abc123');
    expect(result.current.user?.email).toBe('admin@huellitas.org');
  });

  it('recupera la sesión desde el token guardado en localStorage al montar', async () => {
    localStorage.setItem(TOKEN_KEY, 'existing-token');
    vi.mocked(api.apiGetMe).mockResolvedValue(fakeUser);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(api.apiGetMe).toHaveBeenCalledWith('existing-token');
    expect(result.current.user?.email).toBe('admin@huellitas.org');
  });

  it('limpia el token y el usuario al cerrar sesión', async () => {
    vi.mocked(api.apiLogin).mockResolvedValue({ token: 'abc123', user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@huellitas.org', 'secret');
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
