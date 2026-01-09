import request from '../utils/request';

export interface TamVang {
  MADANGKYTAMVANG: number;
  MANHANKHAU: number;
  NOITAMTRU?: string;
  TUNGAY?: string;
  DENNGAY?: string;
  LYDO?: string;
  NHANKHAU?: {
    HOTEN: string;
    SOCANCUOC?: string;
  };
}

export interface CreateTamVangRequest {
  MANHANKHAU: number;
  NOITAMTRU?: string;
  TUNGAY?: string;
  DENNGAY?: string;
  LYDO?: string;
}

export interface UpdateTamVangRequest extends Partial<CreateTamVangRequest> {}

export const tamVangService = {
  /**
   * GET /tam-vang?include
   * Lấy danh sách tạm vắng
   */
  getAll: async (params?: {
    MANHANKHAU?: number;
    page?: number;
    limit?: number;
  }): Promise<{ message: string; data: { tamVangs: TamVang[]; count: number } }> => {
    const queryParams = new URLSearchParams();
    
    if (params?.MANHANKHAU) queryParams.append('MANHANKHAU', String(params.MANHANKHAU));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `/tam-vang?include&${queryParams.toString()}`;
    console.log(`🔵 [Request] GET ${url}`);
    const response = await request.get(url);
    console.log('🟢 [Response] GET /tam-vang:', response);
    return response;
  },

  /**
   * GET /tam-vang/:id?include
   * Lấy chi tiết tạm vắng
   */
  getById: async (id: number): Promise<{ message: string; data: TamVang }> => {
    console.log(`🔵 [Request] GET /tam-vang/${id}?include`);
    const response = await request.get(`/tam-vang/${id}?include`);
    console.log(`🟢 [Response] GET /tam-vang/${id}:`, response);
    return response;
  },

  /**
   * POST /tam-vang
   * Tạo đăng ký tạm vắng mới
   */
  create: async (data: CreateTamVangRequest): Promise<{ message: string; tamVang: TamVang }> => {
    console.log('🔵 [Request] POST /tam-vang:', data);
    const response = await request.post('/tam-vang', data);
    console.log('🟢 [Response] POST /tam-vang:', response);
    return response;
  },

  /**
   * PUT /tam-vang/:id
   * Cập nhật thông tin tạm vắng
   */
  update: async (id: number, data: UpdateTamVangRequest): Promise<{ message: string; tamVang: TamVang }> => {
    console.log(`🔵 [Request] PUT /tam-vang/${id}:`, data);
    const response = await request.put(`/tam-vang/${id}`, data);
    console.log(`🟢 [Response] PUT /tam-vang/${id}:`, response);
    return response;
  },

  /**
   * DELETE /tam-vang/:id
   * Xóa đăng ký tạm vắng
   */
  delete: async (id: number): Promise<{ message: string; tamVang: TamVang }> => {
    console.log(`🔵 [Request] DELETE /tam-vang/${id}`);
    const response = await request.delete(`/tam-vang/${id}`);
    console.log(`🟢 [Response] DELETE /tam-vang/${id}:`, response);
    return response;
  },
};

export default tamVangService;
