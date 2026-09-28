import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.chitfund-loan.enterprise.local/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token & Tenant/Branch headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const role = localStorage.getItem('simulated_role');
      if (role && config.headers) {
        config.headers['X-User-Role'] = role;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      const status = error.response.status;
      if (status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          localStorage.removeItem('auth_token');
          // Optional redirect on actual backend 401
          // window.location.href = '/login?session_expired=1';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
