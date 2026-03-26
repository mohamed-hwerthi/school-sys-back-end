import api from "./axios";

export const ressourcesApi = {
  getByModule: (moduleId: number): Promise<any[]> =>
    api.get(`/ressources/module/${moduleId}`),

  getAll: (): Promise<any[]> =>
    api.get("/ressources"),
};
