export interface Pet {
  id: string;
  name: string;
  species: 'Perro' | 'Gato' | 'Otra';
  speciesId: number;
  breed: string;
  age: string;
  estimatedBirthDate: string | null;
  weight: string;
  weightLbs: number | null;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  sizeId: number;
  gender: 'Macho' | 'Hembra';
  genderId: number;
  temperament: string;
  traits: string[];
  status: 'Disponible' | 'En proceso' | 'Adoptado';
  statusId: number;
  image: string;
  rescueStory: string;
  health: string[];
  needs: string[];
}

export async function fetchPets(): Promise<Pet[]> {
  const response = await fetch('/api/pets');
  if (!response.ok) throw new Error('No se pudieron cargar las mascotas');
  return response.json();
}

export async function fetchPetById(id: string): Promise<Pet | undefined> {
  const response = await fetch(`/api/pets/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('No se pudo cargar la mascota');
  return response.json();
}

export async function createPet(formData: FormData): Promise<Pet> {
  const response = await fetch('/api/pets', { method: 'POST', body: formData });
  if (!response.ok) throw new Error('No se pudo crear la mascota');
  return response.json();
}

export async function updatePet(id: string, formData: FormData): Promise<Pet> {
  const response = await fetch(`/api/pets/${id}`, { method: 'PATCH', body: formData });
  if (!response.ok) throw new Error('No se pudo actualizar la mascota');
  return response.json();
}
