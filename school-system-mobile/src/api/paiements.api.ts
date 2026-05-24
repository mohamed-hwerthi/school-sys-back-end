import api from "./axios";

export const paiementsApi = {
  getByEleve: (studentId: string, anneeScolaire = "2025-2026"): Promise<any[]> =>
    api.get(`/paiements/eleve/${studentId}`, { params: { anneeScolaire } }),
};
