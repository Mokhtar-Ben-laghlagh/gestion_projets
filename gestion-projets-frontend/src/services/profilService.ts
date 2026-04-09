import api from '../utils/axiosConfig';

export const profilService = {
  getAll: () => api.get('/profils'),
  getById: (id: number) => api.get(`/profils/${id}`),
  create: (data: any) => api.post('/profils', data),
  update: (id: number, data: any) => api.put(`/profils/${id}`, data),
  delete: (id: number) => api.delete(`/profils/${id}`),
};
