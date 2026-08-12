export const SPECIES_OPTIONS = [
  { value: 'Perro', label: 'Perro' },
  { value: 'Gato', label: 'Gato' }
] as const;

export const GENDER_OPTIONS = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Hembra', label: 'Hembra' }
] as const;

export const SIZE_OPTIONS = [
  { value: 'Pequeno', label: 'Pequeño' },
  { value: 'Mediano', label: 'Mediano' },
  { value: 'Grande', label: 'Grande' }
] as const;

export const STATUS_OPTIONS = [
  { value: 'Disponible', label: 'Disponible', badgeClass: 'bg-[#20A83E] text-white' },
  { value: 'En_tratamiento', label: 'En tratamiento', badgeClass: 'bg-[#146B27] text-white' },
  { value: 'Reservada', label: 'Reservada', badgeClass: 'bg-[#D9A82E] text-white' },
  { value: 'Adoptada', label: 'Adoptada', badgeClass: 'bg-[#222222] text-white' },
  { value: 'No_disponible', label: 'No disponible', badgeClass: 'bg-[#D9D9D9] text-[#222222]' }
] as const;

export type SizeValue = typeof SIZE_OPTIONS[number]['value'];
export type StatusValue = typeof STATUS_OPTIONS[number]['value'];
export type SpeciesValue = typeof SPECIES_OPTIONS[number]['value'];
export type GenderValue = typeof GENDER_OPTIONS[number]['value'];

export function sizeLabel(value: string) {
  return SIZE_OPTIONS.find(option => option.value === value)?.label ?? value;
}

export function statusLabel(value: string) {
  return STATUS_OPTIONS.find(option => option.value === value)?.label ?? value;
}

export function statusBadgeClass(value: string) {
  return STATUS_OPTIONS.find(option => option.value === value)?.badgeClass ?? 'bg-[#D9D9D9] text-[#222222]';
}
