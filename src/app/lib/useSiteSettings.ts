import { useEffect, useState } from 'react';
import { apiGetSiteSettings, ApiSiteSettings } from './api';

let cached: ApiSiteSettings | null = null;
let pending: Promise<ApiSiteSettings> | null = null;
const listeners = new Set<(settings: ApiSiteSettings) => void>();

function loadSiteSettings() {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = apiGetSiteSettings().then(settings => {
      cached = settings;
      return settings;
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
    if (!settings) {
      let cancelled = false;
      loadSiteSettings().then(result => {
        if (!cancelled) setSettings(result);
      });
    }
    return () => {
      listeners.delete(setSettings);
    };
  }, [settings]);

  return settings;
}
