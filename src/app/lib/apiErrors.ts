// Error de la API con el código HTTP, para distinguir p. ej. una sesión vencida (401) de un fallo de red.
export class ApiRequestError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// Se emite cuando el backend rechaza el token (vencido, usuario desactivado, etc.); AuthContext cierra la sesión.
export const UNAUTHORIZED_EVENT = 'huellitas:unauthorized';
