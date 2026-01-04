import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './constants';

const request: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Log tất cả requests
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.group(`🚀 REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
    console.log(' Config:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
      data: config.data,
    });
    console.groupEnd();
    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Log tất cả responses
request.interceptors.response.use(
  (response: AxiosResponse) => {
    console.group(`✅ RESPONSE: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    console.groupEnd();
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    console.group(`X RESPONSE ERROR: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
    console.groupEnd();

    // Auto refresh token
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('🔄 Refreshing token...');
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        return request(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default request;
