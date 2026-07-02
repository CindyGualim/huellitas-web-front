// Mirrors the fixed catalog ids seeded in the backend (prisma/seed.ts).
// There's no catalogs endpoint yet, so these are hardcoded until species,
// genders, sizes, and statuses become manageable data instead of a fixed seed.
export const SPECIES_OPTIONS = [
  { id: 1, name: 'Perro' },
  { id: 2, name: 'Gato' },
  { id: 3, name: 'Otra' },
] as const;

export const GENDER_OPTIONS = [
  { id: 1, name: 'Macho' },
  { id: 2, name: 'Hembra' },
] as const;

export const SIZE_OPTIONS = [
  { id: 1, name: 'Pequeño' },
  { id: 2, name: 'Mediano' },
  { id: 3, name: 'Grande' },
] as const;

export const STATUS_OPTIONS = [
  { id: 1, name: 'Disponible' },
  { id: 2, name: 'En proceso' },
  { id: 3, name: 'Adoptado' },
] as const;
