import api from "./axios";

export const devoirsApi = {
  getByClasse: (classeId: number): Promise<any[]> =>
    api.get(`/devoirs/classe/${classeId}`),

  getById: (id: number): Promise<any> =>
    api.get(`/devoirs/${id}`),

  getSubmissions: (eleveId: number): Promise<any[]> =>
    api.get(`/soumissions/eleve/${eleveId}`),
};
