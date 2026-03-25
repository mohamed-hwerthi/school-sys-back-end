import api from "./axios";
import type { Evaluation } from "@/types/evaluation";

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

/** Map an ExamenResponseDTO to the frontend Evaluation type. */
export function mapExamenToEvaluation(dto: ExamenDTO): Evaluation {
  return {
    id: dto.id,
    titre: dto.name,
    type: "Contrôle continu",
    matiere: dto.moduleName ?? "",
    niveau: "",
    classe: dto.classeName ?? "",
    date: "",
    heureDebut: "",
    heureFin: "",
    coefficient: dto.coeffEtatique,
    bareme: 20,
    statut: "Planifiée",
    enseignant: dto.teacherName ?? "",
    salle: "",
    notes: "",
  };
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

  getById: async (id: number): Promise<ExamenDTO> => {
    const res = await api.get<ExamenDTO>(`${BASE}/${id}`);
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
