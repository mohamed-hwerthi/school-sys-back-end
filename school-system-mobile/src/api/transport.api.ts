import api from "./axios";

export const transportApi = {
  getAffectation: (eleveId: string): Promise<any[]> =>
    api.get(`/affectations-transport/eleve/${eleveId}`),

  getCircuit: (circuitId: string): Promise<any> =>
    api.get(`/circuits/${circuitId}`),

  getArrets: (circuitId: string): Promise<any[]> =>
    api.get(`/circuits/${circuitId}/arrets`),
};
