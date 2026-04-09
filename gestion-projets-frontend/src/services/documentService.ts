import api from '../utils/axiosConfig';

export const documentService = {
  getByProjet: (projetId: number) => api.get(`/projets/${projetId}/documents`),
  getById: (id: number) => api.get(`/documents/${id}`),
  create: (projetId: number, data: any) => api.post(`/projets/${projetId}/documents`, data),
  update: (id: number, data: any) => api.put(`/documents/${id}`, data),
  delete: (id: number) => api.delete(`/documents/${id}`),
};
