import api from '../utils/axiosConfig';

export const employeService = {
  getAll: () => api.get('/employes'),
  getById: (id: number) => api.get(`/employes/${id}`),
  create: (data: any) => api.post('/employes', data),
  update: (id: number, data: any) => api.put(`/employes/${id}`, data),
  delete: (id: number) => api.delete(`/employes/${id}`),
  getDisponibles: (dateDebut: string, dateFin: string) =>
    api.get('/employes/disponibles', { params: { dateDebut, dateFin } }),
};
