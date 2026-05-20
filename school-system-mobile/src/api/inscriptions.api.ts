import api from "./axios";

/** A submitted school registration. Mirrors backend `InscriptionDTO`. */
export interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string | null;
  lieuNaissance: string | null;
  sexe: string | null;
  adresse: string | null;
  telephoneParent: string | null;
  emailParent: string | null;
  nomParent: string | null;
  prenomParent: string | null;
  niveauId: string | null;
  niveauNom: string | null;
  anneeScolaire: string | null;
  statut: string;
  commentaire: string | null;
  numeroDossier: string | null;
  montantFrais: number | null;
  fraisPaye: boolean;
  createdAt: string;
}

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface InscriptionListParams {
  page?: number;
  size?: number;
  statut?: "SOUMISE" | "ACCEPTEE" | "REFUSEE";
  anneeScolaire?: string;
}

export const inscriptionsApi = {
  /** Paginated list of inscriptions (`MANAGE_INSCRIPTIONS`). */
  list: (params: InscriptionListParams = {}): Promise<PagedResponse<Inscription>> =>
    api.get("/inscriptions", { params: { size: 50, ...params } }),

  /**
   * Updates an inscription's status (accept / refuse).
   * Allowed values: SOUMISE · ACCEPTEE · REFUSEE.
   */
  updateStatut: (id: string, statut: "ACCEPTEE" | "REFUSEE", commentaire?: string): Promise<Inscription> =>
    api.put(`/inscriptions/${id}/statut`, { statut, commentaire }),
};
