import api from "./axios";

/** A homework assignment. Mirrors backend `DevoirDTO`. */
export interface Devoir {
  id: string;
  titre: string;
  description: string | null;
  moduleId: string | null;
  classeId: string | null;
  enseignantId: string | null;
  datePublication: string | null;
  dateLimite: string | null;
  type: string;
  pointsMax: number;
  fichierUrl: string | null;
  statut: string;
  totalSoumissions: number;
}

/** Create/update payload. Mirrors backend `CreateDevoirRequest`. */
export interface DevoirInput {
  titre: string;
  description?: string;
  moduleId?: string;
  classeId?: string;
  datePublication?: string;
  dateLimite: string;
  pointsMax?: number;
}

/** A student's homework submission. Mirrors backend `SoumissionDTO`. */
export interface Soumission {
  id: string;
  devoirId: string;
  devoirTitre: string;
  eleveId: string;
  contenu: string | null;
  fichierUrl: string | null;
  dateSoumission: string | null;
  note: number | null;
  commentaireCorrection: string | null;
  corrige: boolean;
  enRetard: boolean;
}

/** Grading payload. Mirrors backend `CorrectionRequest`. */
export interface CorrectionInput {
  note: number;
  commentaire?: string;
}

export const homeworkApi = {
  /** All homework for the authenticated teacher (scoped server-side). */
  getDevoirs: (): Promise<Devoir[]> =>
    api.get("/devoirs"),

  getDevoir: (id: string): Promise<Devoir> =>
    api.get(`/devoirs/${id}`),

  createDevoir: (input: DevoirInput): Promise<Devoir> =>
    api.post("/devoirs", input),

  updateDevoir: (id: string, input: DevoirInput): Promise<Devoir> =>
    api.put(`/devoirs/${id}`, input),

  closeDevoir: (id: string): Promise<Devoir> =>
    api.put(`/devoirs/${id}/close`),

  deleteDevoir: (id: string): Promise<void> =>
    api.delete(`/devoirs/${id}`),

  getSubmissions: (devoirId: string): Promise<Soumission[]> =>
    api.get(`/soumissions/devoir/${devoirId}`),

  correctSubmission: (id: string, input: CorrectionInput): Promise<Soumission> =>
    api.put(`/soumissions/${id}/correct`, input),
};
