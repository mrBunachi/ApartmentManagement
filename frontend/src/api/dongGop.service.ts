import request from '../utils/request';

export interface CreateDongGopRequest {
  MAHOKHAU: number;
  MADOTTHU?: number;
  MALOAIPHI?: number;
  SOTIENDADONG: number;
  HINHTHUC?: string;
  GHICHU?: string;
}

export const dongGopService = {
  /**
   * POST /dong-gop
   * Tạo phiếu đóng góp mới
   */
  create: async (data: CreateDongGopRequest): Promise<{ message: string; data: any }> => {
    console.log('🔵 [Request] POST /dong-gop:', data);
    const response = await request.post('/dong-gop', data);
    console.log('🟢 [Response] POST /dong-gop:', response);
    return response;
  },
};

export default dongGopService;
