import api from '../utils/axiosConfig';

export const phaseService = {
  getByProjet: (projetId: number) => api.get(`/projets/${projetId}/phases`),
  getById: (id: number) => api.get(`/phases/${id}`),
  create: (projetId: number, data: any) => api.post(`/projets/${projetId}/phases`, data),
  update: (id: number, data: any) => api.put(`/phases/${id}`, data),
  delete: (id: number) => api.delete(`/phases/${id}`),
  updateRealisation: (id: number, etat: boolean) => api.patch(`/phases/${id}/realisation`, { etat }),
  updateFacturation: (id: number, etat: boolean) => api.patch(`/phases/${id}/facturation`, { etat }),
  updatePaiement: (id: number, etat: boolean) => api.patch(`/phases/${id}/paiement`, { etat }),
};
