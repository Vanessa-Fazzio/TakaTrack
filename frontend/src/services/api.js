import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

export const wasteAPI = {
  getBins: () => api.get('/bins'),
  createBin: (data) => api.post('/bins', data),
  getSchedules: () => api.get('/schedules'),
  createSchedule: (data) => api.post('/schedules', data),
  getRecycling: () => api.get('/recycling'),
  createRecycling: (data) => api.post('/recycling', data),
};

export default api;