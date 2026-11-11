import { useEffect, useState } from 'react';
import { apiGetSiteSettings, ApiSiteSettings } from './api';

let cached: ApiSiteSettings | null = null;
let pending: Promise<ApiSiteSettings> | null = null;
const listeners = new Set<(settings: ApiSiteSettings) => void>();

const RETRY_DELAYS_MS = [2000, 5000, 15000];

function loadSiteSettings() {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = apiGetSiteSettings()
      .then(settings => {
        cached = settings;
        listeners.forEach(listener => listener(settings));
        return settings;
      })
      .catch(err => {
        // Una falla no queda guardada: el próximo intento vuelve a pedir la configuración.
        pending = null;
        throw err;
      });
  }
  return pending;
}

export function setSiteSettingsCache(settings: ApiSiteSettings) {
  cached = settings;
  pending = null;
  listeners.forEach(listener => listener(settings));
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<ApiSiteSettings | null>(cached);

  useEffect(() => {
    listeners.add(setSettings);
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Si la primera carga falla (red móvil, servidor reiniciándose), se reintenta unas veces
    // para que el sitio no se quede sin datos bancarios, WhatsApp ni pie de página hasta recargar.
    const attempt = (retry: number) => {
      loadSiteSettings()
        .then(result => {
          if (!cancelled) setSettings(result);
        })
        .catch(() => {
          if (cancelled || retry >= RETRY_DELAYS_MS.length) return;
          timer = setTimeout(() => attempt(retry + 1), RETRY_DELAYS_MS[retry]);
        });
    };

    if (!cached) attempt(0);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      listeners.delete(setSettings);
    };
  }, []);

  return settings;
}
