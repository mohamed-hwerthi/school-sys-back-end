import api from "./axios";

export const absencesApi = {
  getByEleve: (eleveId: string): Promise<any[]> =>
    api.get(`/absences/eleve/${eleveId}`),

  getStats: (classeId: string, mois: number, annee: number): Promise<any> =>
    api.get("/absences/stats", { params: { classeId, mois, annee } }),

  getHistorique: (eleveId: string): Promise<any> =>
    api.get(`/absences/historique/${eleveId}`),
};
