import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiCreatePet, apiGetUsers } from './api';

function mockFetchOk(data: unknown = {}) {
  return vi.fn().mockResolvedValue({
    json: async () => ({ success: true, statusCode: 200, message: 'ok', data })
  });
}

describe('api — peticiones protegidas', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('incluye el header Authorization al crear una mascota', async () => {
    const fetchMock = mockFetchOk({});
    vi.stubGlobal('fetch', fetchMock);

    await apiCreatePet('mi-token', {
      name: 'Test',
      species: 'Perro',
      breed: 'Mestizo',
      gender: 'Macho',
      estimatedAge: '1 año',
      size: 'Mediano',
      weight: 10,
      color: 'Negro',
      description: 'x',
      rescueStory: 'x',
      status: 'Disponible'
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/pets'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer mi-token' })
      })
    );

    vi.unstubAllGlobals();
  });

  it('incluye el header Authorization al listar usuarios', async () => {
    const fetchMock = mockFetchOk([]);
    vi.stubGlobal('fetch', fetchMock);

    await apiGetUsers('otro-token');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer otro-token' })
      })
    );

    vi.unstubAllGlobals();
  });
});
