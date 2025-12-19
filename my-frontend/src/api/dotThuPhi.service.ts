import request from '../utils/request';

const ENDPOINT = '/dot-thu-phi';

export const dotThuPhiService = {
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  getById: (id: any) => request.get(`${ENDPOINT}/${id}`),
  create: (data: any) => request.post(ENDPOINT, data),
  update: (id: any, data: any) => request.put(`${ENDPOINT}/${id}`, data),
  delete: (id: any) => request.delete(`${ENDPOINT}/${id}`),
};