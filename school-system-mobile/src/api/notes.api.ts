import api from "./axios";

export const notesApi = {
  getByStudent: (studentId: string, trimestre = 1): Promise<any[]> =>
    api.get(`/notes/student/${studentId}`, { params: { trimestre } }),

  getMoyennes: (classeId: string, trimestre = 1): Promise<any[]> =>
    api.get("/notes/moyennes", { params: { classeId, trimestre } }),
};
