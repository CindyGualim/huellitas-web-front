import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useApiResource } from './useApiResource';
import { ApiRequestError } from './apiErrors';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(r => { resolve = r; });
  return { promise, resolve };
}

describe('useApiResource', () => {
  it('descarta la respuesta vieja si cambian las dependencias antes de que llegue', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const pending: Record<number, Promise<string>> = { 1: first.promise, 2: second.promise };

    const { result, rerender } = renderHook(({ id }) => useApiResource(() => pending[id], [id]), { initialProps: { id: 1 } });
    rerender({ id: 2 });

    await act(async () => { second.resolve('mascota 2'); });
    await act(async () => { first.resolve('mascota 1'); });

    expect(result.current.data).toBe('mascota 2');
    expect(result.current.loading).toBe(false);
  });

  it('muestra el error en vez de datos vacíos y lo limpia al recargar', async () => {
    let fail = true;
    const { result } = renderHook(() =>
      useApiResource(() => (fail ? Promise.reject(new ApiRequestError('Error interno del servidor', 500)) : Promise.resolve([1])), [])
    );

    await waitFor(() => expect(result.current.error).toBe('Error interno del servidor'));
    expect(result.current.notFound).toBe(false);

    fail = false;
    act(() => result.current.reload());
    await waitFor(() => expect(result.current.data).toEqual([1]));
    expect(result.current.error).toBeNull();
  });

  it('distingue "no encontrado" de un fallo de red', async () => {
    const notFound = renderHook(() => useApiResource(() => Promise.reject(new ApiRequestError('Mascota no encontrada', 404)), []));
    await waitFor(() => expect(notFound.result.current.notFound).toBe(true));

    const offline = renderHook(() => useApiResource(() => Promise.reject(new TypeError('Failed to fetch')), []));
    await waitFor(() => expect(offline.result.current.error).toMatch(/No se pudo conectar/));
    expect(offline.result.current.notFound).toBe(false);
  });

  it('no carga mientras no haya función (p. ej. sin token)', () => {
    const { result } = renderHook(() => useApiResource(null, []));
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
  });
});
