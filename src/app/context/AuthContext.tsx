import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiLogin, apiGetMe, AuthUser } from '../lib/api';
import { ApiRequestError, UNAUTHORIZED_EVENT } from '../lib/apiErrors';

const TOKEN_STORAGE_KEY = 'huellitas_token';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: AuthUser) => void;
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
    const handleUnauthorized = () => logout();
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

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser: setUser }}>
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
