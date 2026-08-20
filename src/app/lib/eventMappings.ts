export const EVENT_TYPE_OPTIONS = [
  { value: 'Jornada_adopcion', label: 'Jornada de adopción' },
  { value: 'Jornada_vacunacion', label: 'Jornada de vacunación' },
  { value: 'Jornada_castracion', label: 'Jornada de castración' },
  { value: 'Feria', label: 'Feria' },
  { value: 'Recaudacion', label: 'Recaudación' },
  { value: 'Otro', label: 'Otro' }
] as const;

export const EVENT_STATUS_OPTIONS = [
  { value: 'Programado', label: 'Programado', badgeClass: 'bg-[#20A83E]/10 text-[#20A83E] border border-[#20A83E]/20' },
  { value: 'En_curso', label: 'En curso', badgeClass: 'bg-[#146B27]/10 text-[#146B27] border border-[#146B27]/20' },
  { value: 'Finalizado', label: 'Finalizado', badgeClass: 'bg-[#D9D9D9]/40 text-[#222222]/70 border border-[#D9D9D9]' },
  { value: 'Cancelado', label: 'Cancelado', badgeClass: 'bg-red-50 text-red-600 border border-red-200' }
] as const;

export function eventTypeLabel(value: string) {
  return EVENT_TYPE_OPTIONS.find(option => option.value === value)?.label ?? value;
}

export function eventStatusLabel(value: string) {
  return EVENT_STATUS_OPTIONS.find(option => option.value === value)?.label ?? value;
}

export function eventStatusBadgeClass(value: string) {
  return EVENT_STATUS_OPTIONS.find(option => option.value === value)?.badgeClass ?? 'bg-[#D9D9D9]/40 text-[#222222]/70';
}

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'Efectivo', label: 'Efectivo' },
  { value: 'Transferencia', label: 'Transferencia' },
  { value: 'Deposito', label: 'Depósito' },
  { value: 'Tarjeta', label: 'Tarjeta' },
  { value: 'Otro', label: 'Otro' }
] as const;

export function paymentMethodLabel(value: string) {
  return PAYMENT_METHOD_OPTIONS.find(option => option.value === value)?.label ?? value;
}
