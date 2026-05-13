import { useEffect, useState, type ReactNode } from 'react';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth';
import { api } from '../services/api';
import { AuthLoginError, login as loginRequest, type AuthCredentials } from '../services/auth.service';
import { AuthContext, type AuthContextValue } from './auth.context';

const getStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
};

const setStoredToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  delete api.defaults.headers.common.Authorization;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStoredToken(token);
  }, [token]);

  const handleLogin = async (credentials: AuthCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const newToken = await loginRequest(credentials);
      setToken(newToken);
      return newToken;
    } catch (error) {
      if (error instanceof AuthLoginError && error.status === 401) {
        setError('Usuário ou senha inválidos. Verifique seus dados e tente novamente.');
      } else if (error instanceof AuthLoginError) {
        setError(error.message);
      } else {
        setError('Não foi possível realizar o login no momento.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setError(null);
    setToken(null);
  };

  const value: AuthContextValue = {
    token,
    isAuthenticated: Boolean(token),
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};