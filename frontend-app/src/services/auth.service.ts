import axios from 'axios';
import { api } from './api';

export interface AuthCredentials {
  usuario: string;
  senha: string;
}

interface AuthLoginResponse {
  token: string;
}

export class AuthLoginError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = 'AuthLoginError';
  }
}

export const login = async (credentials: AuthCredentials): Promise<string> => {
  try {
    const response = await api.post<AuthLoginResponse>('/auth/login', credentials);
    return response.data.token;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const backendMessage = typeof error.response?.data === 'object' && error.response?.data !== null && 'error' in error.response.data
        ? String(error.response.data.error)
        : null;

      if (status === 401) {
        throw new AuthLoginError(backendMessage ?? 'Credenciais inválidas', status);
      }

      throw new AuthLoginError('Não foi possível conectar ao servidor de autenticação', status);
    }

    throw error;
  }
};