import request from '../utils/request';
import type { Resident } from './resident.service';
import type { Household } from './household.service';

export interface ResidencyHistory {
  ID: number;
  MANHANKHAU: number;
  MAHOKHAU?: number | null;
  MAPHONG?: string | null; // Mã phòng để sort
  LOAITHAYDOI?: string | null; // "XOA_HO_KHAU", "CHUYEN_DI", "TACH_KHAU", "TAO_HO_KHAU"
  NGAYBATDAU: string;
  NGAYKETTHUC: string;
  CHUCVU_CU?: string | null;
  GHI_CHU?: string | null;
  NHANKHAU?: {
    HOTEN: string;
    MANHANKHAU: number;
    MAHOKHAU?: number | null;
    SOCANCUOC?: string | null;
    NGAYSINH?: string | null;
  };
  HOKHAU?: {
    MAHOKHAU: number;
    IDCHUHO?: number | null;
    MAPHONG?: string | null;
    LOAICANHO?: string | null;
    DIACHI?: string | null;
  } | null;
}

export const residencyHistoryService = {
  /**
   * GET /lich-su?include
   * Lấy danh sách lịch sử cư trú
   */
  getAll: async (params?: {
    MANHANKHAU?: number;
    MAHOKHAU?: number;
    MAPHONG?: string;
    LOAITHAYDOI?: string;
    page?: number;
    limit?: number;
  }): Promise<{ message: string; data: { hisData: ResidencyHistory[]; countHisData: number } }> => {
    const queryParams = new URLSearchParams();
    queryParams.append('include', '');
    
    if (params?.MANHANKHAU) queryParams.append('MANHANKHAU', String(params.MANHANKHAU));
    if (params?.MAHOKHAU) queryParams.append('MAHOKHAU', String(params.MAHOKHAU));
    if (params?.MAPHONG) queryParams.append('MAPHONG', params.MAPHONG);
    if (params?.LOAITHAYDOI) queryParams.append('LOAITHAYDOI', params.LOAITHAYDOI);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    console.log(`🔵 [Request] GET /lich-su?${queryParams.toString()}`);
    const response = await request.get(`/lich-su?${queryParams.toString()}`);
    console.log('🟢 [Response] GET /lich-su:', response);
    return response;
  },

  /**
   * GET /lich-su/:id?include
   * Lấy chi tiết lịch sử cư trú
   */
  getById: async (id: number): Promise<{ message: string; data: ResidencyHistory[] }> => {
    console.log(`🔵 [Request] GET /lich-su/${id}?include`);
    const response = await request.get(`/lich-su/${id}?include`);
    console.log(`🟢 [Response] GET /lich-su/${id}:`, response);
    return response;
  },
};

export default residencyHistoryService;
