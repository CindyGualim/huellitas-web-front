import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Login } from './Login';
import { AuthProvider } from '../context/AuthContext';
import * as api from '../lib/api';

vi.mock('../lib/api', () => ({
  apiLogin: vi.fn(),
  apiGetMe: vi.fn()
}));

describe('Login — envío de credenciales', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('envía el email y la contraseña ingresados al hacer submit', async () => {
    vi.mocked(api.apiLogin).mockResolvedValue({
      token: 'fake-token',
      user: { id: 1, name: 'Admin', email: 'admin@huellitas.org', phone: '000', role: 'Superadministrador', isActive: true, createdAt: '' }
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@huellitas.org' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(api.apiLogin).toHaveBeenCalledWith('admin@huellitas.org', 'secret123');
    });
  });

  it('muestra el mensaje de error cuando las credenciales son inválidas', async () => {
    vi.mocked(api.apiLogin).mockRejectedValue(new Error('Credenciales inválidas'));

    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'admin@huellitas.org' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'mala-clave' } });
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
