import api from '../utils/axiosConfig';

export const affectationService = {
  getByPhase: (phaseId: number) => api.get(`/phases/${phaseId}/employes`),
  getByEmploye: (employeId: number) => api.get(`/employes/${employeId}/phases`),
  getOne: (phaseId: number, employeId: number) => api.get(`/phases/${phaseId}/employes/${employeId}`),
  create: (phaseId: number, employeId: number, data: any) =>
    api.post(`/phases/${phaseId}/employes/${employeId}`, data),
  update: (phaseId: number, employeId: number, data: any) =>
    api.put(`/phases/${phaseId}/employes/${employeId}`, data),
  delete: (phaseId: number, employeId: number) =>
    api.delete(`/phases/${phaseId}/employes/${employeId}`),
};
