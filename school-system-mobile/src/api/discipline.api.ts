import api from "./axios";

export const disciplineApi = {
  getDossier: (eleveId: number): Promise<any> =>
    api.get(`/discipline/dossier/${eleveId}`),

  getIncidents: (): Promise<any[]> =>
    api.get("/discipline/incidents"),

  getSanctions: (eleveId: number): Promise<any[]> =>
    api.get(`/discipline/sanctions/eleve/${eleveId}`),
};
