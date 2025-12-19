import request from '../utils/request';

// Đổi endpoint thành /ho-khau
const ENDPOINT = '/ho-khau';

export const hoKhauService = {
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  getById: (id: number | string) => request.get(`${ENDPOINT}/${id}`),
  create: (data: any) => request.post(ENDPOINT, data),
  update: (id: number | string, data: any) => request.put(`${ENDPOINT}/${id}`, data),
  delete: (id: number | string) => request.delete(`${ENDPOINT}/${id}`),
};