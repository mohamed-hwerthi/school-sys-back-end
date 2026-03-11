import api from "./axios";

export interface RecommandationDTO {
  id: number;
  studentId: number;
  studentName: string;
  domaineId: number;
  domaineName: string;
  trimestre: number;
  texte: string | null;
}

export interface RecommandationRequest {
  studentId: number;
  domaineId: number;
  trimestre: number;
  texte?: string;
}

export interface ObservationDTO {
  id: number;
  studentId: number;
  studentName: string;
  trimestre: number;
  comportement: string | null;
  certificatType: string | null;
}

export interface ObservationRequest {
  studentId: number;
  trimestre: number;
  comportement?: string;
  certificatType?: string;
}

const BASE = "/appreciations";

export const appreciationsApi = {
  getRecommandations: async (
    studentIds: number[],
    trimestre: number
  ): Promise<RecommandationDTO[]> => {
    const ids = studentIds.join(",");
    const res = await api.get<RecommandationDTO[]>(
      `${BASE}/recommandations?studentIds=${ids}&trimestre=${trimestre}`
    );
    return res.data;
  },

  upsertRecommandations: async (
    items: RecommandationRequest[]
  ): Promise<RecommandationDTO[]> => {
    const res = await api.post<RecommandationDTO[]>(
      `${BASE}/recommandations/bulk`,
      { items }
    );
    return res.data;
  },

  getObservations: async (
    studentIds: number[],
    trimestre: number
  ): Promise<ObservationDTO[]> => {
    const ids = studentIds.join(",");
    const res = await api.get<ObservationDTO[]>(
      `${BASE}/observations?studentIds=${ids}&trimestre=${trimestre}`
    );
    return res.data;
  },

  upsertObservations: async (
    items: ObservationRequest[]
  ): Promise<ObservationDTO[]> => {
    const res = await api.post<ObservationDTO[]>(
      `${BASE}/observations/bulk`,
      { items }
    );
    return res.data;
  },
};
