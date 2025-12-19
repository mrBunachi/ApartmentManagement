import request from '../utils/request';

// ĐÂY LÀ CHỖ DUY NHẤT CẦN SỬA NẾU BACKEND KHÁC:
const ENDPOINT = '/nhan-khau'; 

export const nhanKhauService = {
  // 1. Lấy danh sách (GET /nhan-khau)
  getAll: (params?: any) => {
    return request.get(ENDPOINT, { params });
  },

  // 2. Lấy chi tiết 1 người (GET /nhan-khau/1)
  getById: (id: number | string) => {
    return request.get(`${ENDPOINT}/${id}`);
  },

  // 3. Thêm mới (POST /nhan-khau)
  create: (data: any) => {
    return request.post(ENDPOINT, data);
  },

  // 4. Cập nhật (PUT /nhan-khau/1)
  update: (id: number | string, data: any) => {
    return request.put(`${ENDPOINT}/${id}`, data);
  },

  // 5. Xóa (DELETE /nhan-khau/1)
  delete: (id: number | string) => {
    return request.delete(`${ENDPOINT}/${id}`);
  },
  
  // 6. Tìm kiếm (Ví dụ: GET /nhan-khau/search?q=Nguyen)
  search: (keyword: string) => {
    return request.get(`${ENDPOINT}/search`, { params: { q: keyword } });
  }
};