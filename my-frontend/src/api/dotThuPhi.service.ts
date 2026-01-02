import request from '../utils/request';

const ENDPOINT = '/dot-thu-phi';

export const dotThuPhiService = {
  // Backend trả về: { dotThuPhi: { dotThuPhis: [...], count: X } }
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  
  // Backend trả về: { dotThuPhi: {...} }
  getById: (id: any) => request.get(`${ENDPOINT}/${id}`),
  
  // Backend trả về: { dotThuPhi: {...} }
  create: (data: any) => request.post(ENDPOINT, data),
  
  // Backend trả về: { dotThuPhi: {...} }
  update: (id: any, data: any) => request.put(`${ENDPOINT}/${id}`, data),
  
  // Backend trả về: result object
  delete: (id: any) => request.delete(`${ENDPOINT}/${id}`),
};