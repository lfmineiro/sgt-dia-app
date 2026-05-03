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

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] -> ${response.config.method?.toUpperCase()} ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`[API Error] -> ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${error.response?.status}`);
    return Promise.reject(error);
  }
);