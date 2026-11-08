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
