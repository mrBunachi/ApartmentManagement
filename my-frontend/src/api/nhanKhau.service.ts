import request from "../utils/request";

export default {
  getAll: () => request.get("/nhankhau"),
  getById: (id) => request.get(`/nhankhau/${id}`),
  create: (data) => request.post("/nhankhau", data),
  update: (id, data) => request.put(`/nhankhau/${id}`, data),
  delete: (id) => request.delete(`/nhankhau/${id}`),
};
