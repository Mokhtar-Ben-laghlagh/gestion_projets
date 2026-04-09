import api from '../utils/axiosConfig';

export const projetService = {
  getAll: () => api.get('/projets'),
  getById: (id: number) => api.get(`/projets/${id}`),
  getResume: (id: number) => api.get(`/projets/${id}/resume`),
  create: (data: any) => api.post('/projets', data),
  update: (id: number, data: any) => api.put(`/projets/${id}`, data),
  delete: (id: number) => api.delete(`/projets/${id}`),
};
