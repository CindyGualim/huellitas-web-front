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

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiPage<T> {
  items: T[];
  pagination: ApiPagination;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

function paginationQuery(params?: PaginationParams) {
  const search = new URLSearchParams();
  if (params?.page) search.set('page', String(params.page));
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return query ? `?${query}` : '';
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

export async function apiGetUsers(token: string, params?: PaginationParams) {
  const response = await fetch(`${API_URL}/users${paginationQuery(params)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiPage<AuthUser>>(response);
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
  intakeDate: string;
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
  intakeDate?: string;
  featured?: boolean;
  images?: { imageUrl: string; isCover?: boolean }[];
}

export async function apiGetPets(options?: { availableOnly?: boolean } & PaginationParams) {
  const search = new URLSearchParams(paginationQuery(options).slice(1));
  if (options?.availableOnly) search.set('availableOnly', 'true');
  const query = search.toString();
  const response = await fetch(`${API_URL}/pets${query ? `?${query}` : ''}`);

  return parseResponse<ApiPage<ApiPet>>(response);
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

export async function apiUploadImage(token: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/uploads/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  return parseResponse<{ imageUrl: string }>(response);
}

export interface ApiEventTimeSlot {
  id: number;
  eventId: number;
  startTime: string;
  capacity: number;
  registered: number;
  available: number;
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
  timeSlots: ApiEventTimeSlot[];
}

export interface EventPayload {
  title: string;
  type: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  timeSlots?: { id?: number; startTime: string; capacity: number }[];
}

export interface JornadaDashboard {
  event: ApiEvent;
  timeSlots: ApiEventTimeSlot[];
  totalCapacity: number;
  totalRegistered: number;
  statusSummary: Record<string, number>;
}

export async function apiGetJornadaDashboard(token: string, eventId: number) {
  const response = await fetch(`${API_URL}/events/${eventId}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<JornadaDashboard>(response);
}

export async function apiGetEvents(params?: PaginationParams) {
  const response = await fetch(`${API_URL}/events${paginationQuery(params)}`);

  return parseResponse<ApiPage<ApiEvent>>(response);
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
  donationDate?: string;
  notes?: string;
}

export interface ApiDonationsPage extends ApiPage<ApiDonation> {
  totalAmount: number;
}

export async function apiGetDonations(token: string, params?: PaginationParams) {
  const response = await fetch(`${API_URL}/donations${paginationQuery(params)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiDonationsPage>(response);
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

export type AdoptionRequestStatus = 'Pendiente' | 'En_revision' | 'Aprobada' | 'Rechazada';

export interface ApiAdoptionRequest {
  id: number;
  status: AdoptionRequestStatus;
  reason: string;
  hasChildren: boolean;
  familyAgreement: boolean;
  hasVeterinarian: boolean;
  secureSpace: boolean;
  submittedAt: string;
  adopter: {
    fullName: string;
    dpi: string;
    phone: string;
    email: string;
    address: string;
    municipality: string;
  };
  pet: ApiPet;
}

export async function apiGetAdoptionRequests(token: string, params?: PaginationParams) {
  const response = await fetch(`${API_URL}/adoption-requests${paginationQuery(params)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiPage<ApiAdoptionRequest>>(response);
}

export async function apiUpdateAdoptionRequestStatus(token: string, id: number, status: AdoptionRequestStatus) {
  const response = await fetch(`${API_URL}/adoption-requests/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  return parseResponse<ApiAdoptionRequest>(response);
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

export interface ApiMedicalRecord {
  id: number;
  petId: number;
  consultationDate: string;
  recordType: 'Consulta' | 'Desparasitacion' | 'Tratamiento' | 'Vacunacion' | 'Castracion';
  description: string;
  treatment: string;
  observations: string;
}

export interface MedicalRecordPayload {
  consultationDate: string;
  recordType: string;
  description: string;
  treatment: string;
  observations: string;
}

export async function apiGetMedicalRecords(token: string, petId: number) {
  const response = await fetch(`${API_URL}/medical-records/${petId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiMedicalRecord[]>(response);
}

export async function apiCreateMedicalRecord(token: string, petId: number, payload: MedicalRecordPayload) {
  const response = await fetch(`${API_URL}/medical-records/${petId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiMedicalRecord>(response);
}

export interface ApiPetStatusHistory {
  id: number;
  petId: number;
  previousStatus: string | null;
  newStatus: string;
  note: string | null;
  changedAt: string;
  changedBy: { id: number; name: string };
}

export async function apiGetPetStatusHistory(token: string, petId: number) {
  const response = await fetch(`${API_URL}/pets/${petId}/status-history`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiPetStatusHistory[]>(response);
}

export type CastrationPatientStatus =
  | 'Inscrito'
  | 'Evaluado'
  | 'Aprobado'
  | 'Rechazado'
  | 'Pagado'
  | 'Castrado'
  | 'En_seguimiento'
  | 'Seguimiento_finalizado';

export interface ApiEventRegistration {
  id: number;
  eventId: number;
  timeSlotId: number;
  petName: string;
  species: string;
  gender: 'Macho' | 'Hembra';
  breed: string;
  birthDate: string;
  lastDewormingDate: string;
  lastVaccinationDate: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  procedureType: 'Vacunacion' | 'Castracion';
  status: CastrationPatientStatus;
  surgeryDate: string | null;
  antibioticStatus: 'Pendiente' | 'Finalizado' | null;
  stitchRemovalStatus: 'Pendiente' | 'Finalizado' | null;
  followUpCompleted: boolean;
  observations: string | null;
  notes: string | null;
  createdAt: string;
  event: ApiEvent;
  timeSlot: ApiEventTimeSlot;
}

export interface EventRegistrationPayload {
  eventId: number;
  timeSlotId: number;
  petName: string;
  species: string;
  gender: string;
  breed: string;
  birthDate: string;
  lastDewormingDate: string;
  lastVaccinationDate: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  procedureType: string;
  notes?: string;
}

export interface PatientRecordPayload {
  status?: CastrationPatientStatus;
  surgeryDate?: string | null;
  antibioticStatus?: 'Pendiente' | 'Finalizado' | null;
  stitchRemovalStatus?: 'Pendiente' | 'Finalizado' | null;
  followUpCompleted?: boolean;
  observations?: string | null;
}

export async function apiGetEventRegistrations(token: string, params?: PaginationParams & { eventId?: number; status?: string }) {
  const search = new URLSearchParams(paginationQuery(params).slice(1));
  if (params?.eventId) search.set('eventId', String(params.eventId));
  if (params?.status) search.set('status', params.status);
  const query = search.toString();
  const response = await fetch(`${API_URL}/event-registrations${query ? `?${query}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiPage<ApiEventRegistration>>(response);
}

export async function apiGetEventRegistration(token: string, id: number) {
  const response = await fetch(`${API_URL}/event-registrations/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return parseResponse<ApiEventRegistration>(response);
}

export async function apiCreateEventRegistration(payload: EventRegistrationPayload) {
  const response = await fetch(`${API_URL}/event-registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiEventRegistration>(response);
}

export async function apiUpdatePatientRecord(token: string, id: number, payload: PatientRecordPayload) {
  const response = await fetch(`${API_URL}/event-registrations/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiEventRegistration>(response);
}

export async function apiSendReminder(token: string, id: number, type: 'pre' | 'post') {
  const response = await fetch(`${API_URL}/event-registrations/${id}/send-reminder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ type })
  });

  return parseResponse<null>(response);
}

export interface ApiSiteSettings {
  instagramHandle: string;
  contactEmail: string;
  whatsappNumber: string;
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  donationDropoffAddress: string;
  donationDropoffHours: string;
  neededSupplies: string[];
}

export async function apiGetSiteSettings() {
  const response = await fetch(`${API_URL}/site-settings`);

  return parseResponse<ApiSiteSettings>(response);
}

export async function apiUpdateSiteSettings(token: string, payload: ApiSiteSettings) {
  const response = await fetch(`${API_URL}/site-settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return parseResponse<ApiSiteSettings>(response);
}
