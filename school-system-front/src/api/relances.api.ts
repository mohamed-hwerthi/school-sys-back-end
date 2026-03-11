import api from "./axios";

// ─── Types ───────────────────────────────────────────

export type TypeRelance = "EMAIL" | "SMS" | "COURRIER";
export type StatutRelance = "EN_ATTENTE" | "ENVOYEE" | "ECHOUEE";

export interface RelanceDTO {
  id: number;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  studentClasse: string;
  paiementId: number | null;
  paiementReference: string | null;
  type: TypeRelance;
  statut: StatutRelance;
  message: string;
  destinataire: string;
  montantDu: number | null;
  dateEnvoi: string | null;
  datePrevue: string;
  anneeScolaire: string;
  numeroRelance: number;
  createdAt: string;
}

export interface RelanceRequest {
  studentId: number;
  paiementId?: number | null;
  type: TypeRelance;
  message: string;
  destinataire?: string;
  montantDu?: number;
  datePrevue?: string;
  anneeScolaire?: string;
  numeroRelance?: number;
}

export interface RelanceStats {
  total: number;
  enAttente: number;
  envoyees: number;
  echouees: number;
}

// ─── API calls ───────────────────────────────────────

export const relancesApi = {
  getAll: async (anneeScolaire = "2025-2026"): Promise<RelanceDTO[]> => {
    const res = await api.get<RelanceDTO[]>(`/relances?anneeScolaire=${anneeScolaire}`);
    return res.data;
  },

  getByStudent: async (studentId: number, anneeScolaire = "2025-2026"): Promise<RelanceDTO[]> => {
    const res = await api.get<RelanceDTO[]>(`/relances/eleve/${studentId}?anneeScolaire=${anneeScolaire}`);
    return res.data;
  },

  getPending: async (anneeScolaire = "2025-2026"): Promise<RelanceDTO[]> => {
    const res = await api.get<RelanceDTO[]>(`/relances/en-attente?anneeScolaire=${anneeScolaire}`);
    return res.data;
  },

  getStats: async (anneeScolaire = "2025-2026"): Promise<RelanceStats> => {
    const res = await api.get<RelanceStats>(`/relances/stats?anneeScolaire=${anneeScolaire}`);
    return res.data;
  },

  create: async (data: RelanceRequest): Promise<RelanceDTO> => {
    const res = await api.post<RelanceDTO>("/relances", data);
    return res.data;
  },

  generate: async (anneeScolaire = "2025-2026", type: TypeRelance = "EMAIL"): Promise<RelanceDTO[]> => {
    const res = await api.post<RelanceDTO[]>(`/relances/generer?anneeScolaire=${anneeScolaire}&type=${type}`);
    return res.data;
  },

  markEnvoyee: async (id: number): Promise<RelanceDTO> => {
    const res = await api.patch<RelanceDTO>(`/relances/${id}/envoyee`);
    return res.data;
  },

  markEchouee: async (id: number): Promise<RelanceDTO> => {
    const res = await api.patch<RelanceDTO>(`/relances/${id}/echouee`);
    return res.data;
  },

  delete: (id: number) => api.delete(`/relances/${id}`),
};
