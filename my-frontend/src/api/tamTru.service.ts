import request from '../utils/request';
const ENDPOINT = '/tam-tru';

export const tamTruService = {
  getAll: (params?: any) => request.get(ENDPOINT, { params }),
  getById: (id: any) => request.get(`${ENDPOINT}/${id}`),
  create: (data: any) => request.post(ENDPOINT, data),
  update: (id: any, data: any) => request.put(`${ENDPOINT}/${id}`, data), // Nếu có update
  delete: (id: any) => request.delete(`${ENDPOINT}/${id}`),
};