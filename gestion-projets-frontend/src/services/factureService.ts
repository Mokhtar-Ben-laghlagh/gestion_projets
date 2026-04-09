import api from '../utils/axiosConfig';

export const factureService = {
  getAll: () => api.get('/factures'),
  getById: (id: number) => api.get(`/factures/${id}`),
  create: (phaseId: number, data: any) => api.post(`/phases/${phaseId}/facture`, data),
  update: (id: number, data: any) => api.put(`/factures/${id}`, data),
  delete: (id: number) => api.delete(`/factures/${id}`),
};
