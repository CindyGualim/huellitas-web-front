import { useEffect, useState } from 'react';
import { apiGetSiteSettings, ApiSiteSettings } from './api';

let cached: ApiSiteSettings | null = null;
let pending: Promise<ApiSiteSettings> | null = null;

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

export function useSiteSettings() {
  const [settings, setSettings] = useState<ApiSiteSettings | null>(cached);

  useEffect(() => {
    if (settings) return;
    let cancelled = false;
    loadSiteSettings().then(result => {
      if (!cancelled) setSettings(result);
    });
    return () => {
      cancelled = true;
    };
  }, [settings]);

  return settings;
}
