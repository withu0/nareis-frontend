import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
};

export default api;
