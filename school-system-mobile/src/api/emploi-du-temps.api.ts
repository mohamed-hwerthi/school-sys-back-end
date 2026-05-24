import api from "./axios";

export const emploiDuTempsApi = {
  getByClasse: (classeId: string): Promise<any[]> =>
    api.get(`/emploi-du-temps/classe/${classeId}`),

  getCreneaux: (): Promise<any[]> =>
    api.get("/creneaux"),

  getRemplacements: (): Promise<any[]> =>
    api.get("/emploi-du-temps/remplacements"),
};
