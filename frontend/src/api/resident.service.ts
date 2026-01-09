import request from '../utils/request';

export interface Resident {
  MANHANKHAU: number;
  MAHOKHAU?: number | null;
  HOTEN: string;
  SOCANCUOC?: string | null;
  NGAYSINH?: string | null;
  GIOITINH?: string | null;
  NOISINH?: string | null;
  NGUYENQUAN?: string | null;
  DANTOC?: string | null;
  TONGIAO?: string | null;
  QUOCTICH?: string | null;
  NOITHUONGTRU?: string | null;
  NGHENGHIEP?: string | null;
  NGAYTAO?: string | null;
  NGAYKETTHUC?: string | null;
  QUANHEVOICHUHO?: string | null;
  GHICHU?: string | null;
  ACTIVATE: boolean;
  HOKHAU?: {
    MAHOKHAU: number;
    MAPHONG: string;
    DIACHI?: string;
    LOAICANHO: string;
  };
}

export interface CreateResidentRequest {
  HOTEN: string;
  SOCANCUOC?: string;
  NGAYSINH?: string;
  GIOITINH?: string;
  NOISINH?: string;
  NGUYENQUAN?: string;
  DANTOC?: string;
  TONGIAO?: string;
  QUOCTICH?: string;
  NOITHUONGTRU?: string;
  NGHENGHIEP?: string;
  QUANHEVOICHUHO?: string;
  GHICHU?: string;
  MAHOKHAU?: number;
}

export interface UpdateResidentRequest extends Partial<CreateResidentRequest> {
  ACTIVATE?: boolean;
}

export const residentService = {
  /**
   * GET /nhan-khau?include
   * Lấy danh sách tất cả dân cư kèm thông tin hộ khẩu
   */
  getAll: async (params?: {
    ACTIVATE?: boolean;
    HOTEN?: string;
    SOCANCUOC?: string;
    NGAYSINH?: string;
    page?: number;
    limit?: number;
  }): Promise<{ message: string; residents: { residents: Resident[]; count: number } }> => {
    const queryParams = new URLSearchParams();
    
    if (params?.ACTIVATE !== undefined) queryParams.append('ACTIVATE', String(params.ACTIVATE));
    if (params?.HOTEN) queryParams.append('HOTEN', params.HOTEN);
    if (params?.SOCANCUOC) queryParams.append('SOCANCUOC', params.SOCANCUOC);
    if (params?.NGAYSINH) queryParams.append('NGAYSINH', params.NGAYSINH);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `/nhan-khau?include&${queryParams.toString()}`;
    console.log(`🔵 [Request] GET ${url} - Lấy danh sách dân cư`);
    const response = await request.get(url);
    console.log('🟢 [Response] GET /nhan-khau:', response);
    return response;
  },

  /**
   * GET /nhan-khau/:id?include
   * Lấy thông tin chi tiết 1 dân cư
   */
  getById: async (id: number): Promise<{ message: string; residents: Resident[] }> => {
    console.log(`🔵 [Request] GET /nhan-khau/${id}?include - Lấy thông tin dân cư`);
    const response = await request.get(`/nhan-khau/${id}?include`);
    console.log(`🟢 [Response] GET /nhan-khau/${id}:`, response);
    return response;
  },

  /**
   * POST /nhan-khau
   * Tạo dân cư mới (chỉ bắt buộc HOTEN)
   */
  create: async (data: CreateResidentRequest): Promise<{ message: string; resident: Resident }> => {
    console.log('🔵 [Request] POST /nhan-khau - Tạo dân cư mới:', data);
    const response = await request.post('/nhan-khau', data);
    console.log('🟢 [Response] POST /nhan-khau:', response);
    return response;
  },

  /**
   * PUT /nhan-khau/:id
   * Cập nhật thông tin dân cư
   */
  update: async (id: number, data: UpdateResidentRequest): Promise<{ message: string; updatedRes: Resident }> => {
    console.log(`🔵 [Request] PUT /nhan-khau/${id} - Cập nhật dân cư:`, data);
    const response = await request.put(`/nhan-khau/${id}`, data);
    console.log(`🟢 [Response] PUT /nhan-khau/${id}:`, response);
    return response;
  },

  /**
   * DELETE /nhan-khau/:id
   * Xóa dân cư (kiểm tra xem có là chủ hộ không)
   */
  delete: async (id: number): Promise<{ message: string; deleteRes: Resident }> => {
    console.log(`🔵 [Request] DELETE /nhan-khau/${id} - Xóa dân cư`);
    const response = await request.delete(`/nhan-khau/${id}`);
    console.log(`🟢 [Response] DELETE /nhan-khau/${id}:`, response);
    return response;
  },
};

export default residentService;
