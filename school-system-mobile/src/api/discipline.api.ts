import api from "./axios";

export const disciplineApi = {
  getDossier: (eleveId: string): Promise<any> =>
    api.get(`/discipline/dossier/${eleveId}`),

  getIncidents: (): Promise<any[]> =>
    api.get("/discipline/incidents"),

  getSanctions: (eleveId: string): Promise<any[]> =>
    api.get(`/discipline/sanctions/eleve/${eleveId}`),
};
