import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
  addPayment: (id, data) => api.post(`/orders/${id}/payment`, data),
  getOrderStats: (params) => api.get('/orders/stats', { params }),
  exportOrders: (params) => api.get('/orders/export', { params, responseType: 'blob' }),
};

export const workersAPI = {
  getWorkers: (params) => api.get('/workers', { params }),
  getWorker: (id) => api.get(`/workers/${id}`),
  createWorker: (data) => api.post('/workers', data),
  updateWorker: (id, data) => api.put(`/workers/${id}`, data),
  deleteWorker: (id) => api.delete(`/workers/${id}`),
  addTransaction: (id, data) => api.post(`/workers/${id}/transactions`, data),
  getWorkerStats: (id) => api.get(`/workers/${id}/stats`),
};

export const duesAPI = {
  getDues: (params) => api.get('/dues', { params }),
  createDue: (data) => api.post('/dues', data),
  addPayment: (id, data) => api.post(`/dues/${id}/payments`, data),
  getDueTransactions: (id) => api.get(`/dues/${id}/transactions`),
};

export const reportsAPI = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getWorkerReport: (params) => api.get('/reports/worker', { params }),
  getFinancialReport: (params) => api.get('/reports/financial', { params }),
  exportReport: (params) => api.get('/reports/export', { params, responseType: 'blob' }),
};

export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getRecentDues: () => api.get('/dashboard/recent-dues'),
  getChartData: (params) => api.get('/dashboard/chart-data', { params }),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export default api;
