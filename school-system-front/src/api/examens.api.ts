import api from "./axios";

export interface ExamenDTO {
  id: number;
  name: string;
  namePrive: string | null;
  coeffEtatique: number;
  coeffPrive: number;
  ordreEtatique: number;
  ordrePrive: number;
  classeId: number;
  classeName: string;
  teacherId: number | null;
  teacherName: string;
  moduleId: number;
  moduleName: string;
  versionEtatique: boolean;
  versionPrivee: boolean;
}

export interface ExamenRequest {
  name: string;
  namePrive?: string;
  coeffEtatique: number;
  coeffPrive: number;
  ordreEtatique: number;
  ordrePrive: number;
  classeId: number;
  teacherId?: number;
  moduleId: number;
  versionEtatique: boolean;
  versionPrivee: boolean;
}

const BASE = "/examens";

export const examensApi = {
  getAll: async (moduleId?: number, classeId?: number): Promise<ExamenDTO[]> => {
    const params = new URLSearchParams();
    if (moduleId) params.set("moduleId", String(moduleId));
    if (classeId) params.set("classeId", String(classeId));
    const qs = params.toString();
    const res = await api.get<ExamenDTO[]>(`${BASE}${qs ? `?${qs}` : ""}`);
    return res.data;
  },

  create: async (data: ExamenRequest): Promise<ExamenDTO> => {
    const res = await api.post<ExamenDTO>(BASE, data);
    return res.data;
  },

  update: async (id: number, data: ExamenRequest): Promise<ExamenDTO> => {
    const res = await api.put<ExamenDTO>(`${BASE}/${id}`, data);
    return res.data;
  },

  delete: (id: number) => api.delete(`${BASE}/${id}`),

  deleteBulk: (ids: number[]) => api.delete(`${BASE}/bulk`, { data: ids }),
};
