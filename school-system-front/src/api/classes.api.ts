import api from "./axios";

export interface ClasseDTO {
  id: number;
  letter: string;
  niveauId: number;
  niveauName: string;
  fullName: string;
}

const BASE = "/classes";

export const classesApi = {
  getAll: async (niveauId?: number): Promise<ClasseDTO[]> => {
    const params = niveauId ? `?niveauId=${niveauId}` : "";
    const res = await api.get<ClasseDTO[]>(`${BASE}${params}`);
    return res.data;
  },
};
