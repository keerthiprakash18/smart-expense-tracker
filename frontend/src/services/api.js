import axios from 'axios';

// Vite dev server proxy vazhiya /api nu pogum (zero CORS / zero preflight error)
const isNativeMobile = window.location.protocol.startsWith('capacitor') || (window.location.protocol.startsWith('http') && window.location.port !== '5173');
const API_BASE_URL = isNativeMobile ? 'https://smart-expense-tracker-yhyq.onrender.com' : '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem('access_token', accessToken);
  if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearTokens();
    }
    return Promise.reject(error);
  }
);

export default api;