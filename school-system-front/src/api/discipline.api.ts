import api from "./axios";
import type { Incident, Sanction, DossierDisciplinaire, SanctionSuggestion } from "@/types/discipline";

const BASE = "/discipline";

export const disciplineApi = {
  // --- Incidents ---
  getIncidents: async (): Promise<Incident[]> => {
    const res = await api.get<Incident[]>(`${BASE}/incidents`);
    return res.data;
  },

  getIncidentById: async (id: number): Promise<Incident> => {
    const res = await api.get<Incident>(`${BASE}/incidents/${id}`);
    return res.data;
  },

  createIncident: async (data: Omit<Incident, "id" | "createdAt">): Promise<Incident> => {
    const res = await api.post<Incident>(`${BASE}/incidents`, data);
    return res.data;
  },

  updateIncident: async (id: number, data: Partial<Incident>): Promise<Incident> => {
    const res = await api.put<Incident>(`${BASE}/incidents/${id}`, data);
    return res.data;
  },

  deleteIncident: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/incidents/${id}`);
  },

  // --- Sanctions ---
  getSanctions: async (): Promise<Sanction[]> => {
    const res = await api.get<Sanction[]>(`${BASE}/sanctions`);
    return res.data;
  },

  getSanctionsByEleve: async (eleveId: number): Promise<Sanction[]> => {
    const res = await api.get<Sanction[]>(`${BASE}/sanctions/eleve/${eleveId}`);
    return res.data;
  },

  createSanction: async (data: Omit<Sanction, "id" | "createdAt">): Promise<Sanction> => {
    const res = await api.post<Sanction>(`${BASE}/sanctions`, data);
    return res.data;
  },

  updateSanction: async (id: number, data: Partial<Sanction>): Promise<Sanction> => {
    const res = await api.put<Sanction>(`${BASE}/sanctions/${id}`, data);
    return res.data;
  },

  deleteSanction: async (id: number): Promise<void> => {
    await api.delete(`${BASE}/sanctions/${id}`);
  },

  // --- By student ---
  getByEleve: async (eleveId: number): Promise<{ incidents: Incident[]; sanctions: Sanction[] }> => {
    const res = await api.get<{ incidents: Incident[]; sanctions: Sanction[] }>(
      `${BASE}/eleve/${eleveId}`
    );
    return res.data;
  },

  // --- DISC-004: Workflow ---
  getSanctionSuggestion: async (eleveId: number): Promise<SanctionSuggestion> => {
    const res = await api.get<SanctionSuggestion>(`${BASE}/sanctions/suggestion/${eleveId}`);
    return res.data;
  },

  approveSanction: async (id: number, approuveParId: number, commentaire?: string): Promise<Sanction> => {
    const res = await api.post<Sanction>(`${BASE}/sanctions/${id}/approuver`, {
      approuveParId,
      commentaire,
    });
    return res.data;
  },

  leverSanction: async (id: number): Promise<Sanction> => {
    const res = await api.post<Sanction>(`${BASE}/sanctions/${id}/lever`);
    return res.data;
  },

  // --- DISC-005: Dossier disciplinaire ---
  getDossierDisciplinaire: async (eleveId: number): Promise<DossierDisciplinaire> => {
    const res = await api.get<DossierDisciplinaire>(`${BASE}/dossier/${eleveId}`);
    return res.data;
  },
};
