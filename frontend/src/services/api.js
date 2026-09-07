import axios from "axios";

// ======================================================
// SMART EXPENSE TRACKER - API CONFIG
// ======================================================

// Local development:
// VITE_API_URL=http://127.0.0.1:8000

// Production:
// VITE_API_URL=https://smart-expense-tracker-zaxw.onrender.com

// If VITE_API_URL is missing, use the production backend.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://smart-expense-tracker-zaxw.onrender.com";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000,
});

// ======================================================
// TOKEN HELPERS
// ======================================================

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    // Make sure headers object exists
    config.headers = config.headers || {};

    // Attach JWT token when available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // IMPORTANT:
    // Do not manually set Content-Type for FormData.
    // Browser/Axios must generate the multipart boundary.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Invalid / expired JWT
    if (error.response?.status === 401) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

// ======================================================
// EXPORT
// ======================================================

export default api;