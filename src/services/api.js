import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aivi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('aivi_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// ─── Wilayah (Region) ────────────────────────────────────────────────────────
export const wilayahService = {
  getNegara: () => api.get('/wilayah/negara'),
  getProvinsi: (negaraId) => api.get(`/wilayah/provinsi?negara_id=${negaraId}`),
  getKabupaten: (provinsiId) => api.get(`/wilayah/kabupaten?provinsi_id=${provinsiId}`),
};

// ─── Disasters ────────────────────────────────────────────────────────────────
export const disasterService = {
  getAll: (params) => api.get('/disasters', { params }),
  getById: (id) => api.get(`/disasters/${id}`),
  getAlerts: () => api.get('/disasters/alerts/me'), // user-specific alerts
};

// ─── AI Recommendations ───────────────────────────────────────────────────────
export const aiService = {
  getRecommendation: (disasterId) => api.get(`/ai/recommendations/${disasterId}`),
};