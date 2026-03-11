import api from "./axios";

export interface NoteDTO {
  id: number;
  studentId: number;
  studentName: string;
  examenId: number;
  examenName: string;
  trimestre: number;
  valeur: number | null;
  observation: string | null;
}

export interface NoteRequest {
  studentId: number;
  examenId: number;
  trimestre: number;
  valeur: number | null;
  observation?: string;
}

export interface MoyenneDTO {
  studentId: number;
  studentName: string;
  trimestre: number;
  moyennesParModule: Record<string, number>;
  moyenneGenerale: number;
}

const BASE = "/notes";

export const notesApi = {
  getByExamen: async (examenId: number, trimestre: number): Promise<NoteDTO[]> => {
    const res = await api.get<NoteDTO[]>(`${BASE}?examenId=${examenId}&trimestre=${trimestre}`);
    return res.data;
  },

  getByStudent: async (studentId: number, trimestre: number): Promise<NoteDTO[]> => {
    const res = await api.get<NoteDTO[]>(`${BASE}/student/${studentId}?trimestre=${trimestre}`);
    return res.data;
  },

  upsertBulk: async (notes: NoteRequest[]): Promise<NoteDTO[]> => {
    const res = await api.post<NoteDTO[]>(`${BASE}/bulk`, { notes });
    return res.data;
  },

  getMoyennes: async (classeId: number, trimestre: number): Promise<MoyenneDTO[]> => {
    const res = await api.get<MoyenneDTO[]>(`${BASE}/moyennes?classeId=${classeId}&trimestre=${trimestre}`);
    return res.data;
  },

  delete: (id: number) => api.delete(`${BASE}/${id}`),
};
