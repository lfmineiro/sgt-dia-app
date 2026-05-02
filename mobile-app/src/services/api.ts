import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, 
});

api.interceptors.request.use((config) => {
  console.log(`[API Request] -> ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});