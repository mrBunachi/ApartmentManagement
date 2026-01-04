import request from '../utils/request';

export interface TamTru {
  MADANGKYTAMTRU: number;
  MANHANKHAU: number;
  SODIENTHOAINGUOIDANGKY?: string;
  TUNGAY?: string;
  DENNGAY?: string;
  LYDO?: string;
  NHANKHAU?: {
    HOTEN: string;
    SOCANCUOC?: string;
  };
}

export interface CreateTamTruRequest {
  MANHANKHAU: number;
  SODIENTHOAINGUOIDANGKY?: string;
  TUNGAY?: string;
  DENNGAY?: string;
  LYDO?: string;
}

export interface UpdateTamTruRequest extends Partial<CreateTamTruRequest> {}

export const tamTruService = {
  /**
   * GET /tam-tru?include
   * Lấy danh sách tạm trú
   */
  getAll: async (params?: {
    MANHANKHAU?: number;
    page?: number;
    limit?: number;
  }): Promise<{ message: string; data: { tamTrus: TamTru[]; count: number } }> => {
    const queryParams = new URLSearchParams();
    queryParams.append('include', '');
    
    if (params?.MANHANKHAU) queryParams.append('MANHANKHAU', String(params.MANHANKHAU));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    console.log(`🔵 [Request] GET /tam-tru?${queryParams.toString()}`);
    const response = await request.get(`/tam-tru?${queryParams.toString()}`);
    console.log('🟢 [Response] GET /tam-tru:', response);
    return response;
  },

  /**
   * GET /tam-tru/:id?include
   * Lấy chi tiết tạm trú
   */
  getById: async (id: number): Promise<{ message: string; data: TamTru }> => {
    console.log(`🔵 [Request] GET /tam-tru/${id}?include`);
    const response = await request.get(`/tam-tru/${id}?include`);
    console.log(`🟢 [Response] GET /tam-tru/${id}:`, response);
    return response;
  },

  /**
   * POST /tam-tru
   * Tạo đăng ký tạm trú mới
   */
  create: async (data: CreateTamTruRequest): Promise<{ message: string; tamTru: TamTru }> => {
    console.log('🔵 [Request] POST /tam-tru:', data);
    const response = await request.post('/tam-tru', data);
    console.log('🟢 [Response] POST /tam-tru:', response);
    return response;
  },

  /**
   * PUT /tam-tru/:id
   * Cập nhật thông tin tạm trú
   */
  update: async (id: number, data: UpdateTamTruRequest): Promise<{ message: string; tamTru: TamTru }> => {
    console.log(`🔵 [Request] PUT /tam-tru/${id}:`, data);
    const response = await request.put(`/tam-tru/${id}`, data);
    console.log(`🟢 [Response] PUT /tam-tru/${id}:`, response);
    return response;
  },

  /**
   * DELETE /tam-tru/:id
   * Xóa đăng ký tạm trú
   */
  delete: async (id: number): Promise<{ message: string; tamTru: TamTru }> => {
    console.log(`🔵 [Request] DELETE /tam-tru/${id}`);
    const response = await request.delete(`/tam-tru/${id}`);
    console.log(`🟢 [Response] DELETE /tam-tru/${id}:`, response);
    return response;
  },
};

export default tamTruService;
