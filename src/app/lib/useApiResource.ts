import { DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import { ApiRequestError } from './apiErrors';

// Mensaje para mostrar a partir de cualquier error de una llamada a la API.
export function errorMessage(err: unknown, fallback: string) {
  if (err instanceof ApiRequestError) return err.message;
  // fetch lanza TypeError cuando no hay red o el servidor no responde.
  if (err instanceof TypeError) return 'No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.';
  return err instanceof Error && err.message ? err.message : fallback;
}

export function isNotFound(err: unknown) {
  return err instanceof ApiRequestError && err.status === 404;
}

interface Options {
  // Mensaje si el error no trae uno propio.
  fallbackMessage?: string;
  // Conserva los datos anteriores mientras se cargan los nuevos (p. ej. al cambiar de página).
  // Por defecto se vacían, para no mostrar datos de otra mascota o de otro filtro.
  keepPreviousData?: boolean;
}

// Carga datos de la API con estado de carga y error, y descarta respuestas viejas: si cambian las
// dependencias antes de que llegue la respuesta anterior, esa respuesta se ignora.
// `load` en null significa "todavía no se puede cargar" (p. ej. falta el token).
export function useApiResource<T>(load: (() => Promise<T>) | null, deps: DependencyList, options: Options = {}) {
  const { fallbackMessage = 'No se pudieron cargar los datos', keepPreviousData = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(load !== null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const loadRef = useRef(load);
  loadRef.current = load;
  const lastReloadKey = useRef(reloadKey);

  useEffect(() => {
    const current = loadRef.current;
    const isReload = lastReloadKey.current !== reloadKey;
    lastReloadKey.current = reloadKey;

    if (!current) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);
    if (!isReload && !keepPreviousData) setData(null);

    current()
      .then(result => {
        if (!cancelled) setData(result);
      })
      .catch(err => {
        if (cancelled) return;
        setNotFound(isNotFound(err));
        setError(errorMessage(err, fallbackMessage));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey(key => key + 1), []);

  return { data, setData, loading, error, setError, notFound, reload };
}
