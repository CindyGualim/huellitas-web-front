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

// Zona horaria de la ONG. Los eventos son instantes (fecha + hora) y se muestran en hora de Guatemala,
// sin importar la zona del navegador.
export const ORG_TIME_ZONE = 'America/Guatemala';

export function formatEventDate(value: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Date(value).toLocaleDateString('es-GT', { ...options, timeZone: ORG_TIME_ZONE });
}

// Hora de un horario de jornada ("14:30") en formato de 12 h para mostrar ("2:30 p. m.").
// Se guarda en 24 h para que se ordene bien; valores viejos que no sean HH:mm se muestran tal cual.
export function formatSlotTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  const suffix = hours < 12 ? 'a. m.' : 'p. m.';
  return `${hours % 12 || 12}:${match[2]} ${suffix}`;
}

// Guatemala no tiene horario de verano: siempre UTC-6. Los formularios de eventos trabajan en esa
// hora aunque quien edite tenga el navegador en otra zona (p. ej. de viaje).
const ORG_UTC_OFFSET = '-06:00';

// ISO (UTC) → valor de <input type="datetime-local"> en hora de Guatemala.
export function toOrgDatetimeLocal(isoString?: string) {
  if (!isoString) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ORG_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date(isoString));
  const get = (type: string) => parts.find(part => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

// Valor de <input type="datetime-local"> interpretado en hora de Guatemala → ISO (UTC).
export function fromOrgDatetimeLocal(value: string) {
  return new Date(`${value}:00${ORG_UTC_OFFSET}`).toISOString();
}

// Convierte un ISO (UTC) al formato que espera <input type="datetime-local">, en hora local del navegador.
// Usar isoString.slice(0, 16) mete la hora UTC como si fuera local y corre el evento al guardarlo.
export function toDatetimeLocalValue(isoString?: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Año y mes (0-11) de una fecha sin hora guardada como medianoche UTC (p. ej. donationDate).
export function dateOnlyYearMonth(value: string) {
  const date = new Date(value);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

// Meses completos entre dos fechas, con la misma regla UTC que utils/dateMath.js del backend.
export function monthsBetweenUtc(from: Date, to: Date) {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth());
  if (to.getUTCDate() < from.getUTCDate()) months -= 1;
  return months;
}

// Fecha de nacimiento aproximada (YYYY-MM-DD) a partir de años y meses de edad. Si el día no existe
// en el mes destino (31 de marzo - 1 mes) se usa el último día de ese mes en vez de desbordar.
export function birthDateFromAge(years: number, months: number, today = new Date()) {
  const totalMonths = today.getFullYear() * 12 + today.getMonth() - (years * 12 + months);
  const year = Math.floor(totalMonths / 12);
  const month = totalMonths - year * 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = Math.min(today.getDate(), lastDay);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
