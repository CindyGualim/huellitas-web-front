import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiLogin, apiGetMe, apiLogout, AuthUser } from '../lib/api';
import { ApiRequestError, UNAUTHORIZED_EVENT } from '../lib/apiErrors';

const TOKEN_STORAGE_KEY = 'huellitas_token';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
  // Reemplaza el token de la sesión actual (p. ej. el que devuelve el cambio de contraseña).
  replaceToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    apiGetMe(storedToken)
      .then(fetchedUser => {
        setUser(fetchedUser);
        setToken(storedToken);
      })
      .catch(err => {
        // Solo un token rechazado invalida la sesión; si el backend está caído no se borra.
        if (err instanceof ApiRequestError && err.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    // Token rechazado por el servidor: solo se limpia la sesión local (avisar al servidor no tiene sentido).
    const handleUnauthorized = () => clearSession();
    // Cerrar sesión en una pestaña la cierra también en las demás.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_STORAGE_KEY && !event.newValue) {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: loggedInUser } = await apiLogin(email, password);

    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(loggedInUser);
  };

  // Cierra la sesión local. Si fue la persona quien pidió salir, además se avisa al servidor para
  // que el token deje de servir aunque alguien lo haya copiado (si falla la red, igual se sale).
  const clearSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const logout = () => {
    const current = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (current) apiLogout(current).catch(() => {});
    clearSession();
  };

  const replaceToken = (newToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser: setUser, replaceToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
}
