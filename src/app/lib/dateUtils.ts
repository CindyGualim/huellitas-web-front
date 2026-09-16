// Para fechas que representan un día del calendario (sin hora), no una hora
// puntual: se guardan como medianoche UTC, así que formatearlas con la hora
// local del navegador puede correrlas un día (p. ej. Guatemala es UTC-6).
// Forzar timeZone: 'UTC' al formatear las muestra tal como se guardaron.
export function formatDateOnly(value: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
  return new Date(value).toLocaleDateString('es-GT', { ...options, timeZone: 'UTC' });
}

// Fecha de "hoy" en formato YYYY-MM-DD usando la hora local del navegador,
// para precargar inputs de tipo date. toISOString() convierte a UTC primero,
// lo que puede adelantar la fecha un día en la noche (misma razón que arriba).
export function todayDateInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
