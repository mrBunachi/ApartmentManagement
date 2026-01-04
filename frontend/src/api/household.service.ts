import request from '../utils/request';
import type { Resident } from './resident.service';
import type { FixedFee } from './fixedFee.service';

export interface Household {
  MAHOKHAU: number;
  IDCHUHO?: number | null;
  DIACHI?: string;
  GHICHU?: string;
  XEMAY?: number;
  OTO?: number;
  MAPHONG: string;
  LOAICANHO: string;
  NGAYTAO?: string;
  NGAYKETTHUC?: string;
  ACTIVATE: boolean;
  THONGTINCHUHO?: Resident;
  PHICODINH?: FixedFee;
  NHANKHAU_NHANKHAU_MAHOKHAUToHOKHAU?: Resident[];
}

export interface CreateHouseholdRequest {
  MAPHONG: string;
  LOAICANHO: string;
  IDCHUHO?: number | null;
  DIACHI?: string;
  GHICHU?: string;
  XEMAY?: number;
  OTO?: number;
}

export interface UpdateHouseholdRequest extends Partial<CreateHouseholdRequest> {
  ACTIVATE?: boolean;
}

export const householdService = {
  /**
   * GET /ho-khau?include
   * Lấy danh sách hộ khẩu kèm chủ hộ và phí cố định
   */
  getAll: async (params?: {
    ACTIVATE?: boolean;
    MAPHONG?: string;
    page?: number;
    limit?: number;
    include?: boolean;
  }): Promise<{ message: string; apartments: { apartments: Household[]; count: number } }> => {
    const queryParams = new URLSearchParams();
    if (params?.include !== false) queryParams.append('include', '');
    
    if (params?.ACTIVATE !== undefined) queryParams.append('ACTIVATE', String(params.ACTIVATE));
    if (params?.MAPHONG) queryParams.append('MAPHONG', params.MAPHONG);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    console.log(`🔵 [Request] GET /ho-khau?${queryParams.toString()} - Lấy danh sách hộ khẩu`);
    const response = await request.get(`/ho-khau?${queryParams.toString()}`);
    console.log('🟢 [Response] GET /ho-khau:', response);
    return response;
  },

  /**
   * GET /ho-khau/:id?include
   * Lấy chi tiết hộ khẩu kèm chủ hộ, phí, và danh sách thành viên
   */
  getById: async (id: number): Promise<{ message: string; apartments: Household[] }> => {
    console.log(`🔵 [Request] GET /ho-khau/${id}?include - Lấy chi tiết hộ khẩu`);
    const response = await request.get(`/ho-khau/${id}?include`);
    console.log(`🟢 [Response] GET /ho-khau/${id}:`, response);
    return response;
  },

  /**
   * POST /ho-khau
   * Tạo hộ khẩu mới (MAPHONG, LOAICANHO bắt buộc)
   */
  create: async (data: CreateHouseholdRequest): Promise<{ message: string; apartment: Household }> => {
    console.log('🔵 [Request] POST /ho-khau - Tạo hộ khẩu mới:', data);
    const response = await request.post('/ho-khau', data);
    console.log('🟢 [Response] POST /ho-khau:', response);
    return response;
  },

  /**
   * PUT /ho-khau/:id
   * Cập nhật thông tin hộ khẩu
   */
  update: async (id: number, data: UpdateHouseholdRequest): Promise<{ message: string; apartment: Household }> => {
    console.log(`🔵 [Request] PUT /ho-khau/${id} - Cập nhật hộ khẩu:`, data);
    const response = await request.put(`/ho-khau/${id}`, data);
    console.log(`🟢 [Response] PUT /ho-khau/${id}:`, response);
    return response;
  },

  /**
   * DELETE /ho-khau/:id
   * Xóa hộ khẩu (soft delete)
   */
  delete: async (id: number): Promise<{ message: string; apartment: Household }> => {
    console.log(`🔵 [Request] DELETE /ho-khau/${id} - Xóa hộ khẩu`);
    const response = await request.delete(`/ho-khau/${id}`);
    console.log(`🟢 [Response] DELETE /ho-khau/${id}:`, response);
    return response;
  },

  /**
   * PUT /ho-khau/:id/chu-ho
   * Gán chủ hộ cho hộ khẩu chưa có chủ
   */
  updateHead: async (id: number, idChuHo: number): Promise<{ message: string; apartment: Household }> => {
    console.log(`🔵 [Request] PUT /ho-khau/${id}/chu-ho - Gán chủ hộ:`, idChuHo);
    const response = await request.put(`/ho-khau/${id}/chu-ho`, { IDCHUHO: idChuHo });
    console.log(`🟢 [Response] PUT /ho-khau/${id}/chu-ho:`, response);
    return response;
  },
};

export default householdService;
