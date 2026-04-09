import api from '../utils/axiosConfig';

export const organismeService = {
  getAll: () => api.get('/organismes'),
  getById: (id: number) => api.get(`/organismes/${id}`),
  create: (data: any) => api.post('/organismes', data),
  update: (id: number, data: any) => api.put(`/organismes/${id}`, data),
  delete: (id: number) => api.delete(`/organismes/${id}`),
};
