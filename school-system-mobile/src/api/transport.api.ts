import api from "./axios";

export const transportApi = {
  getAffectation: (eleveId: number): Promise<any[]> =>
    api.get(`/affectations-transport/eleve/${eleveId}`),

  getCircuit: (circuitId: number): Promise<any> =>
    api.get(`/circuits/${circuitId}`),

  getArrets: (circuitId: number): Promise<any[]> =>
    api.get(`/circuits/${circuitId}/arrets`),
};
