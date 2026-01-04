import request from '../utils/request';
import type { User } from '../types/auth';

export interface UpdateAdminRequest {
  TENDANGNHAP?: string;
  HOTEN?: string;
  SODIENTHOAI?: string;
  EMAIL?: string | null;
  VAITRO?: string;
  ACTIVATE?: boolean;
  MATKHAU?: string;
}

export interface CreateAdminRequest {
  user: string;
  name: string;
  password: string;
  phone_number: string;
  email?: string | null;
  role?: string;
}

export const adminService = {
  /**
   * GET /nguoi-quan-ly
   * Lấy danh sách tất cả admin
   */
  getAll: async (): Promise<{ message: string; users: { users: User[]; count: number } }> => {
    console.log('🔵 [Request] GET /nguoi-quan-ly - Lấy danh sách admin');
    const response = await request.get('/nguoi-quan-ly');
    console.log('🟢 [Response] GET /nguoi-quan-ly:', response);
    return response;
  },

  /**
   * GET /nguoi-quan-ly/:id
   * Lấy thông tin chi tiết 1 admin
   */
  getById: async (id: number): Promise<{ message: string; users: User[] }> => {
    console.log(`🔵 [Request] GET /nguoi-quan-ly/${id} - Lấy thông tin admin`);
    const response = await request.get(`/nguoi-quan-ly/${id}`);
    console.log(`🟢 [Response] GET /nguoi-quan-ly/${id}:`, response);
    return response;
  },

  /**
   * PUT /nguoi-quan-ly/:id
   * Cập nhật thông tin admin (chỉ admin_1)
   */
  update: async (id: number, data: UpdateAdminRequest): Promise<{ message: string; updateUser: User }> => {
    console.log(`🔵 [Request] PUT /nguoi-quan-ly/${id}`, data);
    const response = await request.put(`/nguoi-quan-ly/${id}`, data);
    console.log(`🟢 [Response] PUT /nguoi-quan-ly/${id}:`, response);
    return response;
  },

  /**
   * DELETE /nguoi-quan-ly/:id
   * Xóa admin (chỉ admin_1)
   */
  delete: async (id: number): Promise<{ message: string; user: User }> => {
    console.log(`🔵 [Request] DELETE /nguoi-quan-ly/${id}`);
    const response = await request.delete(`/nguoi-quan-ly/${id}`);
    console.log(`🟢 [Response] DELETE /nguoi-quan-ly/${id}:`, response);
    return response;
  },

  /**
   * POST /auth/register
   * Tạo admin mới (chỉ admin_1)
   */
  create: async (data: CreateAdminRequest): Promise<{ message: string }> => {
    console.log('🔵 [Request] POST /auth/register', data);
    const response = await request.post('/auth/register', data);
    console.log('🟢 [Response] POST /auth/register:', response);
    return response;
  },
};
