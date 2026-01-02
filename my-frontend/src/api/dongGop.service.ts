import request from '../utils/request';

const ENDPOINT = '/dong-gop';

export const dongGopService = {
  // Backend trả về: { message, data: [...], pagination: {...} }
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  
  // Backend trả về: { message, data: {...} }
  getById: (id: any) => request.get(`${ENDPOINT}/${id}`),
  
  // Backend trả về: { message, data: {...} }
  create: (data: any) => request.post(ENDPOINT, data),
  
  // Backend trả về: { message, data: {...} }
  update: (id: any, data: any) => request.put(`${ENDPOINT}/${id}`, data),
  
  // Backend trả về: { message, data: {...} }
  delete: (id: any) => request.delete(`${ENDPOINT}/${id}`),
};