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

export const PATIENT_STATUS_OPTIONS = [
  { value: 'Inscrito', label: 'Inscrito', badgeClass: 'bg-[#D9D9D9]/40 text-[#222222]/70' },
  { value: 'Evaluado', label: 'Evaluado', badgeClass: 'bg-blue-50 text-blue-600' },
  { value: 'Aprobado', label: 'Aprobado', badgeClass: 'bg-[#20A83E]/10 text-[#20A83E]' },
  { value: 'Rechazado', label: 'Rechazado', badgeClass: 'bg-red-50 text-red-600' },
  { value: 'Pagado', label: 'Pagado', badgeClass: 'bg-amber-50 text-amber-600' },
  { value: 'Castrado', label: 'Castrado', badgeClass: 'bg-[#146B27]/10 text-[#146B27]' },
  { value: 'En_seguimiento', label: 'En seguimiento', badgeClass: 'bg-purple-50 text-purple-600' },
  { value: 'Seguimiento_finalizado', label: 'Seguimiento finalizado', badgeClass: 'bg-[#222222]/10 text-[#222222]' }
] as const;

export function patientStatusLabel(value: string) {
  return PATIENT_STATUS_OPTIONS.find(option => option.value === value)?.label ?? value;
}

export function patientStatusBadgeClass(value: string) {
  return PATIENT_STATUS_OPTIONS.find(option => option.value === value)?.badgeClass ?? 'bg-[#D9D9D9]/40 text-[#222222]/70';
}

export const FOLLOW_UP_STATUS_OPTIONS = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Finalizado', label: 'Finalizado' }
] as const;
