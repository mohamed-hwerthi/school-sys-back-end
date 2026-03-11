import api from "./axios";

export interface SousDomaineDTO {
  id: number;
  name: string;
  nameAr: string | null;
  ordre: number;
  domaineId: number;
}

export interface DomaineDTO {
  id: number;
  name: string;
  nameAr: string | null;
  ordre: number;
  niveauId: number;
  niveauName: string;
  sousDomaines: SousDomaineDTO[];
}

export interface DomaineRequest {
  name: string;
  nameAr?: string;
  ordre: number;
  niveauId: number;
}

export interface SousDomaineRequest {
  name: string;
  nameAr?: string;
  ordre: number;
  domaineId: number;
}

const BASE = "/domaines";

export const domainesApi = {
  getAll: async (niveauId?: number): Promise<DomaineDTO[]> => {
    const params = niveauId ? `?niveauId=${niveauId}` : "";
    const res = await api.get<DomaineDTO[]>(`${BASE}${params}`);
    return res.data;
  },

  create: async (data: DomaineRequest): Promise<DomaineDTO> => {
    const res = await api.post<DomaineDTO>(BASE, data);
    return res.data;
  },

  update: async (id: number, data: DomaineRequest): Promise<DomaineDTO> => {
    const res = await api.put<DomaineDTO>(`${BASE}/${id}`, data);
    return res.data;
  },

  delete: (id: number) => api.delete(`${BASE}/${id}`),

  // Sous-domaines
  createSousDomaine: async (data: SousDomaineRequest): Promise<SousDomaineDTO> => {
    const res = await api.post<SousDomaineDTO>(`${BASE}/sous-domaines`, data);
    return res.data;
  },

  updateSousDomaine: async (id: number, data: SousDomaineRequest): Promise<SousDomaineDTO> => {
    const res = await api.put<SousDomaineDTO>(`${BASE}/sous-domaines/${id}`, data);
    return res.data;
  },

  deleteSousDomaine: (id: number) => api.delete(`${BASE}/sous-domaines/${id}`),
};
