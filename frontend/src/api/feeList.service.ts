import request from '../utils/request';

export interface FeeListItem {
  MADOTTHU: number;
  MAHOKHAU: number;
  TIENNHA?: number;
  TIENDICHVU?: number;
  TIENXEMAY?: number;
  TIENOTO?: number;
  TIENDIEN?: number;
  SODIEN?: number;
  TIENNUOC?: number;
  SONUOC?: number;
  TIENINTERNET?: number;
  TRANGTHAI: boolean;
  SOTIENDADONG?: number;
  NGAYDONG?: string;
  GHICHU?: string;
  HINHTHUC?: string;
  DOTTHUPHI?: {
    MADOTTHU: number;
    TEN: string;
    NGAYTAO: string;
  };
  HOKHAU?: {
    MAPHONG: string;
    LOAICANHO: string;
    THONGTINCHUHO?: {
      HOTEN: string;
    };
  };
  PHITHUHO?: {
    DONGIADIEN?: number;
    DONGIANUOC?: number;
    TONGDIEN?: number;
    TONGTIENDIEN?: number;
    TONGNUOC?: number;
    TONGTIENNUOC?: number;
  };
}

export interface DongGopItem {
  MADONGGOP: number;
  MADOTTHU?: number;
  MAHOKHAU?: number;
  MALOAIPHI?: number;
  SOTIENDADONG?: number;
  TRANGTHAI?: boolean;
  NGAYDONG?: string;
  GHICHU?: string;
  HINHTHUC?: string;
  DOTTHUPHI?: {
    TEN: string;
  };
  HOKHAU?: {
    MAPHONG: string;
    THONGTINCHUHO?: {
      HOTEN: string;
    };
  };
  LOAIPHI?: {
    TEN: string;
  };
}

export const feeListService = {
  /**
   * GET /danh-sach-thu-phi/:madotthu
   * Lấy danh sách hóa đơn của đợt thu bắt buộc
   */
  getFeeListByDotThu: async (maDotThu: number): Promise<{ data: FeeListItem[] }> => {
    console.log(`🔵 [Request] GET /danh-sach-thu-phi/${maDotThu}`);
    const response = await request.get(`/danh-sach-thu-phi/${maDotThu}`);
    console.log(`🟢 [Response] GET /danh-sach-thu-phi/${maDotThu}:`, response);
    return response;
  },

  /**
   * GET /danh-sach-thu-phi/:madotthu/:mahokhau
   * Lấy chi tiết hóa đơn của 1 hộ
   */
  getFeeDetail: async (maDotThu: number, maHoKhau: number): Promise<FeeListItem> => {
    console.log(`🔵 [Request] GET /danh-sach-thu-phi/${maDotThu}/${maHoKhau}`);
    const response = await request.get(`/danh-sach-thu-phi/${maDotThu}/${maHoKhau}`);
    console.log(`🟢 [Response] GET /danh-sach-thu-phi/${maDotThu}/${maHoKhau}:`, response);
    return response;
  },

  /**
   * PATCH /danh-sach-thu-phi/:madotthu/:mahokhau/payment
   * Cập nhật trạng thái thanh toán
   */
  updatePayment: async (
    maDotThu: number,
    maHoKhau: number,
    data: { SOTIENDADONG: number; HINHTHUC?: string; GHICHU?: string }
  ): Promise<{ message: string; updated: FeeListItem }> => {
    console.log(`🔵 [Request] PATCH /danh-sach-thu-phi/${maDotThu}/${maHoKhau}/payment:`, data);
    const response = await request.patch(`/danh-sach-thu-phi/${maDotThu}/${maHoKhau}/payment`, data);
    console.log(`🟢 [Response] PATCH /danh-sach-thu-phi/${maDotThu}/${maHoKhau}/payment:`, response);
    return response;
  },

  /**
   * GET /dong-gop?MADOTTHU=X
   * Lấy danh sách đóng góp của đợt tự nguyện
   */
  getDongGopByDotThu: async (params: {
    MADOTTHU?: number;
    MAHOKHAU?: number;
    MALOAIPHI?: number;
    page?: number;
    limit?: number;
  }): Promise<{ dongGops: DongGopItem[]; count: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params.MADOTTHU) queryParams.append('MADOTTHU', String(params.MADOTTHU));
    if (params.MAHOKHAU) queryParams.append('MAHOKHAU', String(params.MAHOKHAU));
    if (params.MALOAIPHI) queryParams.append('MALOAIPHI', String(params.MALOAIPHI));
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));

    console.log(`🔵 [Request] GET /dong-gop?${queryParams.toString()}`);
    const response = await request.get(`/dong-gop?${queryParams.toString()}`);
    console.log(`🟢 [Response] GET /dong-gop:`, response);
    return response;
  },
};

export default feeListService;
