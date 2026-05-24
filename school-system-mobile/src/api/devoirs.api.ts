import api from "./axios";

export const devoirsApi = {
  getByClasse: (classeId: string): Promise<any[]> =>
    api.get(`/devoirs/classe/${classeId}`),

  getById: (id: string): Promise<any> =>
    api.get(`/devoirs/${id}`),

  getSubmissions: (eleveId: string): Promise<any[]> =>
    api.get(`/soumissions/eleve/${eleveId}`),
};
