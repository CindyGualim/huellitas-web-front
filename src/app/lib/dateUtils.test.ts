import { describe, it, expect } from 'vitest';
import { toDatetimeLocalValue, dateOnlyYearMonth, monthsBetweenUtc, birthDateFromAge } from './dateUtils';

describe('dateUtils', () => {
  it('toDatetimeLocalValue ida y vuelta no corre la hora (regresión: +6 h al editar un evento)', () => {
    const original = '2026-12-05T15:00:00.000Z';
    const local = toDatetimeLocalValue(original);
    expect(new Date(local).toISOString()).toBe(original);
  });

  it('dateOnlyYearMonth ubica una donación del día 1 en su mes (regresión: caía en el mes anterior)', () => {
    expect(dateOnlyYearMonth('2026-11-01T00:00:00.000Z')).toEqual({ year: 2026, month: 10 });
  });

  it('monthsBetweenUtc coincide con la regla del backend', () => {
    expect(monthsBetweenUtc(new Date('2026-06-06'), new Date('2026-12-05T15:00:00Z'))).toBe(5);
  });

  it('birthDateFromAge no desborda al final de mes', () => {
    expect(birthDateFromAge(0, 1, new Date(2026, 2, 31))).toBe('2026-02-28');
    expect(birthDateFromAge(1, 0, new Date(2026, 10, 8))).toBe('2025-11-08');
  });
});

describe('formatSlotTime', () => {
  it('muestra horarios HH:mm en formato de 12 h', async () => {
    const { formatSlotTime } = await import('./dateUtils');
    expect(formatSlotTime('09:00')).toBe('9:00 a. m.');
    expect(formatSlotTime('13:30')).toBe('1:30 p. m.');
    expect(formatSlotTime('00:15')).toBe('12:15 a. m.');
    expect(formatSlotTime('12:00')).toBe('12:00 p. m.');
    expect(formatSlotTime('9:00 AM')).toBe('9:00 AM');
  });
});

describe('fechas de eventos en hora de Guatemala', () => {
  it('ida y vuelta sin depender de la zona del navegador', async () => {
    const { toOrgDatetimeLocal, fromOrgDatetimeLocal } = await import('./dateUtils');
    expect(toOrgDatetimeLocal('2026-12-01T15:00:00.000Z')).toBe('2026-12-01T09:00');
    expect(fromOrgDatetimeLocal('2026-12-01T09:00')).toBe('2026-12-01T15:00:00.000Z');
    expect(toOrgDatetimeLocal('2026-12-02T02:30:00.000Z')).toBe('2026-12-01T20:30');
  });
});
