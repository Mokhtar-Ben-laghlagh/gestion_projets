import api from '../utils/axiosConfig';

export const documentService = {
  getByProjet: (projetId: number) => api.get(`/projets/${projetId}/documents`),
  getById: (id: number) => api.get(`/documents/${id}`),
  create: (projetId: number, data: any) => api.post(`/projets/${projetId}/documents`, data),
  update: (id: number, data: any) => api.put(`/documents/${id}`, data),
  delete: (id: number) => api.delete(`/documents/${id}`),
  upload: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  download: async (id: number, filename: string) => {
    try {
      const response = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      if (err.response && err.response.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          err.response.data = json;
        } catch (e) {
          // ignore
        }
      }
      throw err;
    }
  },
};

