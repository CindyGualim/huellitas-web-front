const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type UserRole = 'Superadministrador' | 'Voluntario' | 'Operador';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
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

export async function apiUpdateProfile(token: string, payload: { name: string; phone: string }) {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<AuthUser>(response);
}

export async function apiChangePassword(token: string, payload: { currentPassword: string; newPassword: string }) {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<null>(response);
}

export async function apiForgotPassword(email: string) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return parseResponse<null>(response);
}

export async function apiResetPassword(token: string, password: string) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });

  return parseResponse<null>(response);
}

export interface UserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export async function apiGetUsers(token: string) {
  const response = await fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<AuthUser[]>(response);
}

export async function apiCreateUser(token: string, payload: UserPayload) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
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

export async function apiGetPets(options?: { availableOnly?: boolean }) {
  const query = options?.availableOnly ? '?availableOnly=true' : '';
  const response = await fetch(`${API_URL}/pets${query}`);

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

export interface ApiEvent {
  id: number;
  title: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'Programado' | 'En_curso' | 'Finalizado' | 'Cancelado';
  createdBy: number;
  isActive: boolean;
  createdAt: string;
}

export interface EventPayload {
  title: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
}

export async function apiGetEvents() {
  const response = await fetch(`${API_URL}/events`);

  return parseResponse<ApiEvent[]>(response);
}

export async function apiGetEvent(id: number) {
  const response = await fetch(`${API_URL}/events/${id}`);

  return parseResponse<ApiEvent>(response);
}

export async function apiCreateEvent(token: string, payload: EventPayload) {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiEvent>(response);
}

export async function apiUpdateEvent(token: string, id: number, payload: Partial<EventPayload>) {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiEvent>(response);
}

export async function apiDeleteEvent(token: string, id: number) {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<null>(response);
}

export interface ApiDonation {
  id: number;
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMethod: string;
  donationDate: string;
  notes: string | null;
}

export interface DonationPayload {
  donorName: string;
  donorEmail: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

export async function apiGetDonations(token: string) {
  const response = await fetch(`${API_URL}/donations`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiDonation[]>(response);
}

export async function apiCreateDonation(token: string, payload: DonationPayload) {
  const response = await fetch(`${API_URL}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiDonation>(response);
}

export async function apiUpdateDonation(token: string, id: number, payload: Partial<DonationPayload>) {
  const response = await fetch(`${API_URL}/donations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiDonation>(response);
}

export interface ApiAdoptionRequest {
  id: number;
  status: 'Pendiente' | 'En_revision' | 'Aprobada' | 'Rechazada';
  submittedAt: string;
  adopter: { fullName: string };
  pet: { name: string };
}

export async function apiGetAdoptionRequests(token: string) {
  const response = await fetch(`${API_URL}/adoption-requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiAdoptionRequest[]>(response);
}

export interface AdoptionRequestPayload {
  fullName: string;
  dpi: string;
  phone: string;
  email: string;
  address: string;
  municipality: string;
  petId: number;
  reason: string;
  hasChildren: boolean;
  familyAgreement: boolean;
  hasVeterinarian: boolean;
  secureSpace: boolean;
}

export async function apiCreateAdoptionRequest(payload: AdoptionRequestPayload) {
  const response = await fetch(`${API_URL}/adoption-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseResponse<{ id: number }>(response);
}
