import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const httpClient = axios.create({
  baseURL: API_BASE,
});

export function withAuth(token) {
  const instance = axios.create({
    baseURL: API_BASE,
  });
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return instance;
}
