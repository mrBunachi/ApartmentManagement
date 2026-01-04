import request from '../utils/request';

export interface DotThuPhi {
  MADOTTHU: number;
  TEN: string;
  BATBUOC: boolean;
  NGAYTAO?: string;
  MOTA?: string;
  NGUOIQUANLYId: number;
  NGUOIQUANLY?: {
    id: number;
    HOTEN: string;
    TENDANGNHAP: string;
  };
}

export interface CreateDotThuPhiRequest {
  TEN: string;
  BATBUOC: boolean;
  MOTA?: string;
  NGUOIQUANLYId: number;
}

export interface UpdateDotThuPhiRequest extends Partial<CreateDotThuPhiRequest> {}

export interface BillItemInput {
  MAHOKHAU: number;
  SODIEN: number;
  SONUOC: number;
  DONGIADIEN: number;
  DONGIANUOC: number;
  TIENINTERNET?: number;
}

export const dotThuPhiService = {
  /**
   * GET /dot-thu-phi
   * Lấy danh sách đợt thu phí
   */
  getAll: async (params?: {
    TEN?: string;
    BATBUOC?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ dotThuPhi: { dotThuPhis: DotThuPhi[]; count: number } }> => {
    const queryParams = new URLSearchParams();
    
    if (params?.TEN) queryParams.append('TEN', params.TEN);
    if (params?.BATBUOC !== undefined) queryParams.append('BATBUOC', String(params.BATBUOC));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    console.log(`🔵 [Request] GET /dot-thu-phi?${queryParams.toString()}`);
    const response = await request.get(`/dot-thu-phi?${queryParams.toString()}`);
    console.log('🟢 [Response] GET /dot-thu-phi:', response);
    return response;
  },

  /**
   * GET /dot-thu-phi/:id
   * Lấy chi tiết đợt thu phí
   */
  getById: async (id: number): Promise<{ dotThuPhi: { dotThuPhi: DotThuPhi } }> => {
    console.log(`🔵 [Request] GET /dot-thu-phi/${id}`);
    const response = await request.get(`/dot-thu-phi/${id}`);
    console.log(`🟢 [Response] GET /dot-thu-phi/${id}:`, response);
    return response;
  },

  /**
   * POST /dot-thu-phi
   * Tạo đợt thu phí mới
   */
  create: async (data: CreateDotThuPhiRequest): Promise<{ dotThuPhi: DotThuPhi }> => {
    console.log('🔵 [Request] POST /dot-thu-phi:', data);
    const response = await request.post('/dot-thu-phi', data);
    console.log('🟢 [Response] POST /dot-thu-phi:', response);
    return response;
  },

  /**
   * PUT /dot-thu-phi/:id
   * Cập nhật đợt thu phí
   */
  update: async (id: number, data: UpdateDotThuPhiRequest): Promise<{ dotThuPhi: DotThuPhi }> => {
    console.log(`🔵 [Request] PUT /dot-thu-phi/${id}:`, data);
    const response = await request.put(`/dot-thu-phi/${id}`, data);
    console.log(`🟢 [Response] PUT /dot-thu-phi/${id}:`, response);
    return response;
  },

  /**
   * DELETE /dot-thu-phi/:id
   * Xóa đợt thu phí
   */
  delete: async (id: number): Promise<{ message: string }> => {
    console.log(`🔵 [Request] DELETE /dot-thu-phi/${id}`);
    const response = await request.delete(`/dot-thu-phi/${id}`);
    console.log(`🟢 [Response] DELETE /dot-thu-phi/${id}:`, response);
    return response;
  },

  /**
   * POST /bill/bat-buoc/:madotthu
   * Tạo hóa đơn hàng loạt (chỉ số điện nước)
   */
  createBulkBills: async (maDotThu: number, bills: BillItemInput[]): Promise<{
    message: string;
    summary: { total: number; success: number; failed: number };
    details: { success: any[]; errors: any[] };
  }> => {
    console.log(`🔵 [Request] POST /bill/bat-buoc/${maDotThu}:`, bills);
    const response = await request.post(`/bill/bat-buoc/${maDotThu}`, bills);
    console.log(`🟢 [Response] POST /bill/bat-buoc/${maDotThu}:`, response);
    return response;
  },
};

export default dotThuPhiService;
