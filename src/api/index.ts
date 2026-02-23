import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// Axios drops the path from baseURL when request url starts with "/".
// This interceptor restores the correct base path for all requests.
api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/') && config.baseURL) {
    try {
      const base = new URL(config.baseURL);
      const basePath = base.pathname.replace(/\/$/, '');
      if (basePath) {
        config.url = basePath + config.url;
        config.baseURL = base.origin;
      }
    } catch {}
  }
  return config;
});

export default api;