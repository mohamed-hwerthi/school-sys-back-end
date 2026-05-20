import api from "./axios";

/** A quiz. Mirrors backend `QuizDTO`. */
export interface Quiz {
  id: string;
  titre: string;
  description: string | null;
  classeId: string | null;
  moduleId: string | null;
  dureeMinutes: number | null;
  noteTotale: number | null;
  statut: string;
  totalQuestions: number;
  totalTentatives: number;
}

/** A quiz question. Subset of backend `QuestionDTO`. */
export interface QuizQuestion {
  id: string;
  texte: string;
  typeQuestion: string;
  points: number | null;
  ordre: number | null;
}

/** A quiz with its questions. Mirrors backend `QuizDetailDTO`. */
export interface QuizDetail {
  id: string;
  titre: string;
  description: string | null;
  classeId: string | null;
  moduleId: string | null;
  dureeMinutes: number | null;
  noteTotale: number | null;
  statut: string;
  questions: QuizQuestion[];
}

export const quizzesApi = {
  /** All quizzes for the authenticated teacher (scoped server-side). */
  getQuizzes: (): Promise<Quiz[]> =>
    api.get("/quiz"),

  getQuizDetail: (id: string): Promise<QuizDetail> =>
    api.get(`/quiz/${id}/detail`),

  /** Publishes a draft quiz so students can take it. */
  publishQuiz: (id: string): Promise<Quiz> =>
    api.put(`/quiz/${id}/publish`),
};
