import api from '../utils/axiosConfig';

export const livrablesService = {
  getByPhase: (phaseId: number) => api.get(`/phases/${phaseId}/livrables`),
  getById: (id: number) => api.get(`/livrables/${id}`),
  create: (phaseId: number, data: any) => api.post(`/phases/${phaseId}/livrables`, data),
  update: (id: number, data: any) => api.put(`/livrables/${id}`, data),
  delete: (id: number) => api.delete(`/livrables/${id}`),
};
