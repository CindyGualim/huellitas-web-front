const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Administrador' | 'Voluntario';
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body: ApiResponse<T> = await response.json();

  if (!body.success) {
    throw new Error(body.message);
  }

  return body.data;
}

export async function apiLogin(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return parseResponse<{ token: string; user: AuthUser }>(response);
}

export async function apiGetMe(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<AuthUser>(response);
}

export interface ApiPetImage {
  id: number;
  imageUrl: string;
  isCover: boolean;
}

export interface ApiPet {
  id: number;
  name: string;
  species: 'Perro' | 'Gato';
  breed: string;
  gender: 'Macho' | 'Hembra';
  estimatedAge: string;
  size: 'Pequeno' | 'Mediano' | 'Grande';
  weight: number;
  color: string;
  description: string;
  rescueStory: string;
  status: 'Disponible' | 'En_tratamiento' | 'Reservada' | 'Adoptada' | 'No_disponible';
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  images: ApiPetImage[];
}

export interface PetPayload {
  name: string;
  species: string;
  breed: string;
  gender: string;
  estimatedAge: string;
  size: string;
  weight: number;
  color: string;
  description: string;
  rescueStory: string;
  status: string;
  featured?: boolean;
  images?: { imageUrl: string; isCover?: boolean }[];
}

export async function apiGetPets() {
  const response = await fetch(`${API_URL}/pets`);

  return parseResponse<ApiPet[]>(response);
}

export async function apiGetPet(id: number) {
  const response = await fetch(`${API_URL}/pets/${id}`);

  return parseResponse<ApiPet>(response);
}

export async function apiCreatePet(token: string, payload: PetPayload) {
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiPet>(response);
}

export async function apiUpdatePet(token: string, id: number, payload: Partial<PetPayload>) {
  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiPet>(response);
}

export async function apiDeletePet(token: string, id: number) {
  const response = await fetch(`${API_URL}/pets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<null>(response);
}
