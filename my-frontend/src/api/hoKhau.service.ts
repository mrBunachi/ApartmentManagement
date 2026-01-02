import request from '../utils/request';

const ENDPOINT = '/ho-khau';

export const hoKhauService = {
  // Backend trả về: { message, apartments: { apartments: [...], count: X } }
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  
  // Backend trả về: { message, apartments: [single_item] }
  getById: (id: number | string) => request.get(`${ENDPOINT}/${id}`),
  
  // Backend trả về: { message, apartment: {...} }
  create: (data: any) => request.post(ENDPOINT, data),
  
  // Backend trả về: { message, apartment: {...} }
  update: (id: number | string, data: any) => request.put(`${ENDPOINT}/${id}`, data),
  
  // Backend trả về: { message, apartment: {...} }
  delete: (id: number | string) => request.delete(`${ENDPOINT}/${id}`),
};