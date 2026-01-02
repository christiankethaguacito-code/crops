import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your computer's IP address when testing on physical device
// For Android emulator: use 10.0.2.2
// For iOS simulator: use localhost
// For physical device: use your computer's local IP (e.g., 192.168.1.100)
const API_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'  // Android Emulator
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // You can navigate to login here if needed
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await api.post('/auth/logout').catch(() => {});
  },

  getCurrentUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Farmer services
export const farmerService = {
  getDashboardData: async () => {
    const response = await api.get('/farmer/me');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/farmer/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/farmer/profile', data);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/farmer/reports');
    return response.data;
  },
};

// Report services
export const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getReportDetails: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  uploadMedia: async (reportId, formData) => {
    const response = await api.post(`/reports/${reportId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateReport: async (reportId, data) => {
    const response = await api.put(`/reports/${reportId}`, data);
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },
};

// Admin services
export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getFarmers: async (params) => {
    const response = await api.get('/admin/farmers', { params });
    return response.data;
  },

  getFarmerDetails: async (farmerId) => {
    const response = await api.get(`/admin/farmers/${farmerId}`);
    return response.data;
  },

  getReports: async (params) => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  updateReportStatus: async (reportId, status) => {
    const response = await api.patch(`/admin/reports/${reportId}/status`, { status });
    return response.data;
  },

  getDailySummary: async (date) => {
    const response = await api.get('/admin/reports/daily-summary', { params: { date } });
    return response.data;
  },
};

export default api;
