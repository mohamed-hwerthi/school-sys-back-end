import api from "./axios";

export const quizApi = {
  getByClasse: (classeId: number): Promise<any[]> =>
    api.get(`/quiz/classe/${classeId}`),

  getDetail: (id: number): Promise<any> =>
    api.get(`/quiz/${id}/detail`),

  startAttempt: (data: { quizId: number; eleveId: number }): Promise<any> =>
    api.post("/tentatives/start", data),

  submitAnswers: (data: { tentativeId: number; reponses: any[] }): Promise<any> =>
    api.post("/tentatives/submit", data),

  getAttempts: (eleveId: number): Promise<any[]> =>
    api.get(`/tentatives/eleve/${eleveId}`),

  getAttempt: (id: number): Promise<any> =>
    api.get(`/tentatives/${id}`),
};
