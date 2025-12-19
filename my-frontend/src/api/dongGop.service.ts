import request from '../utils/request';

const ENDPOINT = '/dong-gop';

export const dongGopService = {
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  // API thống kê: Xem ai chưa đóng, ai đóng rồi (thường cần thiết)
  getThongKe: (maDotThu: any) => request.get(`${ENDPOINT}/thong-ke/${maDotThu}`),
  create: (data: any) => request.post(ENDPOINT, data), // Ghi nhận đóng tiền
  delete: (id: any) => request.delete(`${ENDPOINT}/${id}`),
};