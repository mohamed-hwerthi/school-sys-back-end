import api from "./axios";

export const quizApi = {
  getByClasse: (classeId: string): Promise<any[]> =>
    api.get(`/quiz/classe/${classeId}`),

  getDetail: (id: string): Promise<any> =>
    api.get(`/quiz/${id}/detail`),

  startAttempt: (data: { quizId: string; eleveId: string }): Promise<any> =>
    api.post("/tentatives/start", data),

  submitAnswers: (data: { tentativeId: string; reponses: any[] }): Promise<any> =>
    api.post("/tentatives/submit", data),

  getAttempts: (eleveId: string): Promise<any[]> =>
    api.get(`/tentatives/eleve/${eleveId}`),

  getAttempt: (id: string): Promise<any> =>
    api.get(`/tentatives/${id}`),
};
