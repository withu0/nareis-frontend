import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL|| 'http://localhost:5000/api' ;
export const BACKEND_URL = API_URL.replace('/api', ''); // Get backend base URL without /api

// Helper function to get full URL for avatar/uploaded files
export const getFileUrl = (relativePath: string | undefined | null): string => {
  if (!relativePath) return '';
  // If already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // If relative path, prepend backend URL
  return `${BACKEND_URL}${relativePath}`;
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (email: string, password: string, fullName: string) => {
    const response = await api.post('/auth/signup', { email, password, fullName });
    if (response.data.data?.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get('/user/subscription');
    return response.data;
  },
};

// Stripe API
export const stripeAPI = {
  createCheckoutSession: async (data: {
    tier: string;
    successUrl?: string;
    cancelUrl?: string;
  }) => {
    const response = await api.post('/stripe/create-checkout-session', data);
    return response.data;
  },

  getBillingPortal: async () => {
    const response = await api.get('/stripe/billing-portal');
    return response.data;
  },

  getSubscription: async () => {
    const response = await api.get('/stripe/subscription');
    return response.data;
  },

  verifyPayment: async (sessionId: string, tier: string) => {
    const response = await api.post('/stripe/verify-payment', { sessionId, tier });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Dashboard statistics
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // User management
  getUsers: async (filters?: { status?: string; role?: string; tier?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.tier) params.append('tier', filters.tier);
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (data: any) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.post('/admin/users', data, config);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.put(`/admin/users/${id}`, data, config);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  approveUser: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/approve`);
    return response.data;
  },

  rejectUser: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/reject`);
    return response.data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (filters?: { status?: string; eventType?: string; upcoming?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.upcoming) params.append('upcoming', 'true');
    
    const response = await api.get(`/events?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.post('/events', data, config);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const config = data instanceof FormData ? {
      headers: { 'Content-Type': 'multipart/form-data' }
    } : {};
    const response = await api.put(`/events/${id}`, data, config);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  register: async (eventId: string, data?: any) => {
    const response = await api.post(`/events/${eventId}/register`, data || {});
    return response.data;
  },

  cancelRegistration: async (eventId: string) => {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  },

  checkRegistration: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/my-registration`);
    return response.data;
  },

  getRegistrations: async (eventId: string) => {
    const response = await api.get(`/events/${eventId}/registrations`);
    return response.data;
  },
};

// Statistics API
export const statisticsAPI = {
  getPublicStats: async () => {
    try {
      const response = await api.get('/statistics/public');
      // Backend returns: { data: {...}, error: null }
      // But axios wraps it, so response.data = { data: {...}, error: null }
      if (response.data.error) {
        return { data: null, error: response.data.error };
      }
      return { data: response.data.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.error || error.message || 'Failed to fetch statistics' 
      };
    }
  },
};

// Members API
export const membersAPI = {
  getMembers: async () => {
    const response = await api.get('/members');
    return response.data;
  },

  getMemberById: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },
};

export default api;
