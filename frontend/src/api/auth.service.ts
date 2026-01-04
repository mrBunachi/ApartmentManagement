import axios from 'axios';
import { API_URL } from '../utils/constants';
import type { LoginRequest, AuthResponse, UserInfoResponse } from '../types/auth';

// Auth service sử dụng axios riêng với withCredentials
const authRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const authService = {
  /**
   * POST /auth/login
   * Backend set cookies (accessToken, refreshToken)
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await authRequest.post('/auth/login', data);
    return response.data;
  },

  /**
   * POST /auth/refresh
   * Refresh accessToken bằng refreshToken cookie
   */
  refresh: async (): Promise<AuthResponse> => {
    const response = await authRequest.post('/auth/refresh');
    return response.data;
  },

  /**
   * POST /auth/logout
   * Xóa cookies
   */
  logout: async (): Promise<AuthResponse> => {
    const response = await authRequest.post('/auth/logout');
    return response.data;
  },

  /**
   * GET /nguoi-quan-ly/me
   * Lấy thông tin user hiện tại
   */
  getMe: async (): Promise<UserInfoResponse> => {
    const response = await authRequest.get('/nguoi-quan-ly/me');
    return response.data;
  },
};
