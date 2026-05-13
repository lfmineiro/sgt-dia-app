import { createContext } from 'react';
import type { AuthCredentials } from '../services/auth.service';

export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: AuthCredentials) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);