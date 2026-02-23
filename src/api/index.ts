import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// Prepend /api to all relative paths
api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith('http')) {
    config.url = '/api' + (config.url.startsWith('/') ? config.url : '/' + config.url);
  }
  return config;
});

export default api;