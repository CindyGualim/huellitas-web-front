import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  apiLogin: vi.fn(),
  apiGetMe: vi.fn(),
  apiLogout: vi.fn()
}));

const TOKEN_KEY = 'huellitas_token';

const fakeUser = { id: 1, name: 'Admin', email: 'admin@huellitas.org', phone: '000', role: 'Superadministrador' as const, isActive: true, createdAt: '', lastLoginAt: null };

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

  it('limpia el token y el usuario al cerrar sesión, y avisa al servidor', async () => {
    vi.mocked(api.apiLogin).mockResolvedValue({ token: 'abc123', user: fakeUser });
    vi.mocked(api.apiLogout).mockRejectedValue(new TypeError('Failed to fetch'));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('admin@huellitas.org', 'secret');
    });

    act(() => {
      result.current.logout();
    });

    // Aunque falle la red, la sesión local se cierra igual.
    expect(api.apiLogout).toHaveBeenCalledWith('abc123');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('replaceToken guarda el token nuevo (cambio de contraseña)', async () => {
    vi.mocked(api.apiLogin).mockResolvedValue({ token: 'abc123', user: fakeUser });

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(async () => {
      await result.current.login('admin@huellitas.org', 'secret');
    });

    act(() => {
      result.current.replaceToken('token-nuevo');
    });

    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-nuevo');
    expect(result.current.token).toBe('token-nuevo');
    expect(result.current.user?.email).toBe('admin@huellitas.org');
  });
});
