import request from '../utils/request';

export interface FixedFee {
  LOAICANHO: string;
  GIATIENCANHO?: number;
  PHIQLCHUNGCU?: number;
  PHIXEMAY?: number;
  PHIXEOTO?: number;
}

export interface CreateFixedFeeRequest {
  LOAICANHO: string;
  GIATIENCANHO?: number;
  PHIQLCHUNGCU?: number;
  PHIXEMAY?: number;
  PHIXEOTO?: number;
}

export interface UpdateFixedFeeRequest {
  GIATIENCANHO?: number;
  PHIQLCHUNGCU?: number;
  PHIXEMAY?: number;
  PHIXEOTO?: number;
}

export const fixedFeeService = {
  /**
   * GET /phi-co-dinh
   * Lấy danh sách tất cả loại căn hộ và giá
   */
  getAll: async (): Promise<{ message: string; data: FixedFee[]; total: number }> => {
    console.log('🔵 [Request] GET /phi-co-dinh - Lấy danh sách phí cố định');
    const response = await request.get('/phi-co-dinh');
    console.log('🟢 [Response] GET /phi-co-dinh:', response);
    return response;
  },

  /**
   * GET /phi-co-dinh/:loaicanho
   * Lấy thông tin chi tiết 1 loại căn hộ
   */
  getById: async (loaicanho: string): Promise<{ message: string; data: FixedFee }> => {
    console.log(`🔵 [Request] GET /phi-co-dinh/${loaicanho} - Lấy thông tin phí cố định`);
    const response = await request.get(`/phi-co-dinh/${loaicanho}`);
    console.log(`🟢 [Response] GET /phi-co-dinh/${loaicanho}:`, response);
    return response;
  },

  /**
   * POST /phi-co-dinh
   * Tạo loại căn hộ mới với giá
   */
  create: async (data: CreateFixedFeeRequest): Promise<{ message: string; data: FixedFee }> => {
    console.log('🔵 [Request] POST /phi-co-dinh - Tạo phí cố định mới:', data);
    const response = await request.post('/phi-co-dinh', data);
    console.log('🟢 [Response] POST /phi-co-dinh:', response);
    return response;
  },

  /**
   * PUT /phi-co-dinh/:loaicanho
   * Cập nhật giá phí cho loại căn hộ
   */
  update: async (loaicanho: string, data: UpdateFixedFeeRequest): Promise<{ message: string; data: FixedFee }> => {
    console.log(`🔵 [Request] PUT /phi-co-dinh/${loaicanho} - Cập nhật phí cố định:`, data);
    const response = await request.put(`/phi-co-dinh/${loaicanho}`, data);
    console.log(`🟢 [Response] PUT /phi-co-dinh/${loaicanho}:`, response);
    return response;
  },

  /**
   * DELETE /phi-co-dinh/:loaicanho
   * Xóa loại căn hộ
   */
  delete: async (loaicanho: string): Promise<{ message: string }> => {
    console.log(`🔵 [Request] DELETE /phi-co-dinh/${loaicanho} - Xóa phí cố định`);
    const response = await request.delete(`/phi-co-dinh/${loaicanho}`);
    console.log(`🟢 [Response] DELETE /phi-co-dinh/${loaicanho}:`, response);
    return response;
  },
};

export default fixedFeeService;
