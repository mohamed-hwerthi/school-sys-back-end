import api from "./axios";

export const parentPortalApi = {
  getChildren: (): Promise<any[]> =>
    api.get("/parent-portal/children"),

  getChildNotes: (studentId: number, trimestre = 1): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/notes`, { params: { trimestre } }),

  getChildAbsences: (studentId: number): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/absences`),

  getChildBulletin: (studentId: number, classeId: number, trimestre = 1): Promise<any> =>
    api.get(`/parent-portal/children/${studentId}/bulletin`, { params: { classeId, trimestre } }),

  getChildEmploiDuTemps: (studentId: number): Promise<any[]> =>
    api.get(`/parent-portal/children/${studentId}/emploi-du-temps`),
};
