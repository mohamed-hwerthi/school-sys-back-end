import api from "./axios";

export const cantineApi = {
  getMenus: (semaine: number): Promise<any[]> =>
    api.get(`/cantine/menus/semaine/${semaine}`),

  getAbonnement: (eleveId: number): Promise<any[]> =>
    api.get(`/cantine/abonnements/eleve/${eleveId}`),
};
