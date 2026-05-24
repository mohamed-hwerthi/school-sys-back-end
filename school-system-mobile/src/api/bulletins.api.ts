import api from "./axios";

export const bulletinsApi = {
  getStudentBulletin: (studentId: string, classeId: string, trimestre = 1, version = "etatique"): Promise<any> =>
    api.get(`/bulletins/student/${studentId}`, { params: { classeId, trimestre, version } }),

  getStatsReussite: (classeId: string, trimestre: number): Promise<any> =>
    api.get(`/bulletins/stats/classe/${classeId}/trimestre/${trimestre}`),
};
