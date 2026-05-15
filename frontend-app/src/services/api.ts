import axios from 'axios';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: BASE_URL, 
  headers: {
    'Content-Type': 'application/json'
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const token = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});